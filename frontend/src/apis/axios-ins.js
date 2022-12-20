import axios from "axios";

export default ({ baseURL, headers = {} }) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      ...headers,
    };
    return config;
  });

  instance.interceptors.response.use(
    (res) => res.data,
    (err) => {
      const status = err?.response?.status;
      console.log(status, err);
      return null;
    }
  );
  return instance;
};
