export const setTokenService = (token: string) => {
  localStorage.setItem('token', token);
};

export const setRefreshTokenService = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const getTokenService = () => localStorage.getItem('token');

export const clearTokenService = () => localStorage.removeItem('token');

export const isLogin = () => {
  if (localStorage.getItem('token')) return true;
  return false;
};

export const saveToken = (refreshToken: string, token: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('token', token);
};

export const destroyToken = () => {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
};
