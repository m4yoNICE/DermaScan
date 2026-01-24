const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoosePaginate = require("mongoose-paginate");

// 1 - all access, 2 - Master, 3 - Sub-Master
const adminSchema = new mongoose.Schema(
  {
    blockStatus: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      minlength: [4, "Password should be at least six (4) characters long."],
      maxlength: [24, "Password reached maximum length."],
    },
    password: {
      type: String,
      minlength: [4, "Password should be at least six (4) characters long."],
      maxlength: [64, "Password reached maximum length."],
    },
    displayname: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: { createdAt: true },
  }
);

adminSchema.plugin(mongoosePaginate);

function encryptAsync(key, iv, cipherText, callback) {
  try {
    key = Buffer.from(key);
    cipherText = Buffer.from(cipherText, "utf-8");

    let cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    let encrypted = cipher.update(cipherText, "utf-8", "base64");
    encrypted += cipher.final("base64");
    callback(undefined, encrypted);
  } catch (error) {
    return callback(error);
  }
}

function encryptAuth(auth, key) {
  return new Promise(function (resolve, reject) {
    let iv = Buffer.alloc(key.length, key);

    encryptAsync(key, iv, auth, function (err, plain) {
      if (err) {
        reject(err);
        return;
      }
      resolve(plain);
    });
  });
}

adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();

  delete adminObject.password;

  return adminObject;
};

adminSchema.methods.generateAuthToken = function () {
  const admin = this;
  const token = jwt.sign(
    { _id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET
  );

  return token;
};

adminSchema.statics.findByCredentials = async (username, password) => {
  const admin = await Admin.findOne({ username });
  if (!admin) throw new Error("Invalid username or password.");

  return encryptAuth(password, "0123456789abcdef").then((res) => {
    if (res !== admin.password) {
      throw new Error("Invalid username or password.");
    } else {
      return admin;
    }
  });
  // const isMatch = await bcrypt.compare(password, user.password)
  // if (!isMatch) throw new Error('Invalid email or password.')

  // return user
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.password) {
    admin.password = await encryptAuth(admin.password, "0123456789abcdef");
  }

  // if (user.isModified('password')) {
  //   user.password = await bcrypt.hash(user.password, 10)
  // }

  next();
});

const Admin = mongoose.model("Admin", adminSchema);

exports.Admin = Admin;