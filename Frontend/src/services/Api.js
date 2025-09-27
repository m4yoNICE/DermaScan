import Http from "./Http";

const registerAccountAPI = (register) => {
  return Http.post("/auth/register", register);
};

const loginAccountAPI = (id) => {
  return Http.post("/auth/login", id);
};

const Api = { registerAccountAPI, loginAccountAPI };
export default Api;
