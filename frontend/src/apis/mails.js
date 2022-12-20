import axiosIns from "./axios-ins";

const mailInstance = axiosIns({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {},
});

export const getAll = () => {
  return mailInstance.get(`/mail`);
};
export const createNew = (data) => {
  return mailInstance.post(`/mail`, {
    ...data
  });
};
export const getOneStatus = (id) => {
  return mailInstance.get(`/mail/${id}`);
};
