import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/billing";

async function getBillings() {
  return http.get(`${apiEndpoint}`);
}

async function getBilling(billingId) {
  return http.get(`${apiEndpoint}/${billingId}`);
}

async function addBilling(billing) {
  return http.post(`${apiEndpoint}`, billing);
}

async function updateBilling(billing) {
  return http.put(`${apiEndpoint}/${billing.id}`, billing);
}

async function deleteBilling(billingId) {
  return http.delete(`${apiEndpoint}/${billingId}`);
}

export default {
  getBillings,
  getBilling,
  addBilling,
  updateBilling,
  deleteBilling,
};
