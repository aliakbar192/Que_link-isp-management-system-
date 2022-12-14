import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/user";

async function createUser(user) {
  return http.post(`${apiEndpoint}`, user);
}
async function getUsers() {
  return http.get(`${apiEndpoint}`);
}

async function getUser(userId) {
  return http.get(`${apiEndpoint}/${userId}`);
}

export default {
  createUser,
  getUser,
  getUsers,
};
