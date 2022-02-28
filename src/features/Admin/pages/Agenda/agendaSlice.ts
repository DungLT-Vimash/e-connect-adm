import moment from 'moment';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../app/store';
import { Status } from '../../../../constants/type';
import {
  getListAgendas,
  getListAgendaByName,
  getListAgendaByDateToDate,
  getListAgendaByDateToDateAndByName,
} from '../../../../apis/Agenda';

export type Agenda = {
  id: string;
  name: string;
  createdAt: string;
  status: boolean;
  reason: string;
  dayoff: number;
  startDate: string;
  endDate: string;
};

export interface AgendaState {
  agenda: Agenda[];
  total: number;
  isLoading: boolean;
  statusInfo: Status | null;
}

export interface Pages {
  page: number;
  rowsPerPage: number;
  search: string;
  start: any;
  end: any;
}

export const getAgendas = createAsyncThunk(
  'admin/agenda/getAgendas',
  async (
    { page, rowsPerPage, search, start, end }: Pages,
    { rejectWithValue }
  ) => {
    try {
      if (search !== '' && start === null && end === null) {
        const res: any = await getListAgendaByName(search, page, rowsPerPage);
        return res.data;
      }

      if (search === '' && start !== null && end !== null) {
        const res: any = await getListAgendaByDateToDate(
          moment(start).toISOString(),
          moment(end).toISOString(),
          page,
          rowsPerPage
        );
        return res.data;
      }

      if (search !== '' && start !== null && end !== null) {
        const res: any = await getListAgendaByDateToDateAndByName(
          search,
          moment(start).toISOString(),
          moment(end).toISOString(),
          page,
          rowsPerPage
        );
        return res.data;
      }

      const res: any = await getListAgendas(page, rowsPerPage);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState: AgendaState = {
  agenda: [],
  total: 0,
  isLoading: false,
  statusInfo: null,
};

const agendaSlice = createSlice({
  name: 'admin/agenda',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAgendas.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getAgendas.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.agenda = payload.result;
      state.total = payload.total;
    });
    builder.addCase(getAgendas.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = action.payload;
    });
  },
});

export const selectAgenda = (state: RootState) => state.agenda;

const { reducer: agendaReducer } = agendaSlice;
export default agendaReducer;
