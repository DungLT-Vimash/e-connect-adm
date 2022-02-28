import axios from 'axios';
import { saveToken } from '../features/Auth/Login/token';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const request = axios.create({
  baseURL: API_ENDPOINT as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  config => {
    try {
      config.headers['x-access-token'] = localStorage.getItem('token');
    } catch (e: any) {
      return e.message;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

let isRefreshing = false;
let subscribers: any[] = [];

function subscribeTokenRefresh(cb: any) {
  subscribers.push(cb);
}

function onRrefreshed(token: string) {
  subscribers.map(cb => cb(token));
}

request.interceptors.response.use(undefined, err => {
  const {
    config,
    response: { status },
  } = err;
  const originalRequest = config;

  if (status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      axios
        .post(`${API_ENDPOINT}/auth/refreshToken`, {
          refreshToken: localStorage.getItem('refreshToken'),
        })
        .then(respaonse => {
          const { data } = respaonse;
          isRefreshing = false;
          onRrefreshed(data.accessToken);
          saveToken(data.refresh_token, data.access_token);
          subscribers = [];
        });
    }

    return new Promise(resolve => {
      subscribeTokenRefresh((token: string) => {
        originalRequest.headers['x-access-token'] = `${token}`;
        resolve(axios(originalRequest));
      });
    });
  }
  return Promise.reject(err);
});

if (localStorage.getItem('token')) {
  setInterval(() => {
    axios
      .post(`${API_ENDPOINT}/auth/refreshToken`, {
        refreshToken: localStorage.getItem('refreshToken'),
      })
      .then(respaonse => {
        const { data } = respaonse;
        saveToken(data.refresh_token, data.access_token);
      });
  }, 120000);
}
export default request;
