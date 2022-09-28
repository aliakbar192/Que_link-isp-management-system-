import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/admin";

async function getAdmin(adminId) {
  return http.get(`${apiEndpoint}/${adminId}`);
}


export default {
  getAdmin
};
