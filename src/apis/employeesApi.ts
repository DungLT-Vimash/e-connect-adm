import { IEmployee } from '../features/Admin/pages/Employees/pages/CreateEmployee/CreateEmployee';
import axiosService from '../helpers/axiosService';

export type IPage = number | string | undefined;

interface IResetPass {
  currentPassword: string;
  newPassword: string;
}

const employeesApi = {
  getListEmployees() {
    const url = '/listEmployees';
    return axiosService.get(url);
  },

  getEmployeeById(id: string | undefined) {
    const url = `/employees/getEmployeebyId/${id}`;
    return axiosService.get(url);
  },

  createNewEmployee(data: IEmployee) {
    const url = `/employees`;
    return axiosService.post(url, data);
  },

  updateEmployee(id: string | undefined, data: IEmployee) {
    const url = `/editEmployees/${id}`;
    return axiosService.put(url, data);
  },

  getListFilterEmployee(filter: string) {
    const url = `/employees/search?${filter}`;
    return axiosService.get(url);
  },
  resetPassword(id: string, data: IResetPass) {
    const url = `/auth/resetPassword?id=${id}`;
    return axiosService.put(url, data);
  },
  getStatusInfo(id: string) {
    const url = `/get_information?id=${id}`;
    return axiosService.get(url);
  },
  updateStatusEmployee(id: string, data: { createdDate: Date | string }) {
    const url = `deactive?id=${id}`;
    return axiosService.post(url, data);
  },
};

export default employeesApi;
