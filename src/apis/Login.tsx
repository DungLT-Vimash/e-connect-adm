import axiosService from '../helpers/axiosService';

const URL: string = 'auth/login';
interface Login {
  phoneNumber: string;
  password: string;
}

export const login = (data: Login) => {
  return axiosService.post(`/${URL}`, data);
};
