import axiosService from '../helpers/axiosService';
import { Agenda } from '../features/Admin/pages/Agenda/agendaSlice';

const URL: string = 'agenda';

export const getListAgendas = (page: number, rowsPerPage: number) => {
  return axiosService.get(`/${URL}?page=${page}&limit=${rowsPerPage}`);
};

export const getListAgendaByName = (
  name: string,
  page: number,
  rowsPerPage: number
) => {
  return axiosService.get(
    `/${URL}?name=${name}&page=${page}&limit=${rowsPerPage}`
  );
};

export const getListAgendaByDateToDate = (
  startDate: string,
  endDate: string,
  page: number,
  rowsPerPage: number
) => {
  return axiosService.get(
    `/${URL}?start=${startDate}&end=${endDate}&page=${page}&limit=${rowsPerPage}`
  );
};

export const getListAgendaByDateToDateAndByName = (
  name: string,
  startDate: string,
  endDate: string,
  page: number,
  rowsPerPage: number
) => {
  return axiosService.get(
    `/${URL}?name=${name}&start=${startDate}&end=${endDate}&page=${page}&limit=${rowsPerPage}`
  );
};

export const getListAgendaById = (id: string) => {
  return axiosService.get(`/${URL}?id=${id}`);
};

export const getListAgendaByDate = (date: string) => {
  return axiosService.get(`/${URL}?start=${date}&end=${date}`);
};

export const updateStatus = (id: string, data: Agenda) => {
  return axiosService.put(`/${URL}?id=${id}`, data);
};

export const getListAgendaByStatus = (status: boolean) => {
  return axiosService.get(`/${URL}?status=${status}`);
};
