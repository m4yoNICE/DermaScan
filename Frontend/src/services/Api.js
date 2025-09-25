import Http from "./Http";

const registerAccountAPI = (register) => {
  return Http.post("/auth/register", register);
};

const loginAccountAPI = (login) => {
  return Http.post("/auth/login", login);
};

const Api = { registerAccountAPI, loginAccountAPI };
export default Api;
