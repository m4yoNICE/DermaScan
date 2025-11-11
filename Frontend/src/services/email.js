const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/api/forget-password', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jamesdavidguba2@gmail.com',
        pass: 'yourpasswordhere' // Use environment variables or secure vaults in production
    }
  });
});

// Create email options linked to the forgot password function
const mailOptions = {
    from: 'jamesdavidguba2@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: 'Click the link to reset your password: http://yourfrontend.com/reset-password'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error){
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
    } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Password reset email sent' });
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});