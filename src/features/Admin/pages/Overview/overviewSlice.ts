import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../app/store';
import { Status } from '../../../../constants/type';
import employeesApi from '../../../../apis/employeesApi';
import { Agenda } from '../Agenda/agendaSlice';
import {
  getListAgendaByDate,
  getListAgendaByStatus,
} from '../../../../apis/Agenda';

export type Overview = {
  totalEmployees: number;
  dayOffToday: number;
  notification: number;
};

export interface OverviewState {
  overview: Overview;
  agenda: Agenda[];
  isLoading: boolean;
  statusInfo: Status | null | undefined | string;
}

export const getTotalEmployee = createAsyncThunk(
  'admin/overview/getTotalEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const res: any = await employeesApi.getListEmployees();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDayOfToday = createAsyncThunk(
  'admin/overview/getDayOfToday',
  async (date: string, { rejectWithValue }) => {
    try {
      const res: any = await getListAgendaByDate(date);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getNotification = createAsyncThunk(
  'admin/overview/getNotification',
  async (status: boolean, { rejectWithValue }) => {
    try {
      const res: any = await getListAgendaByStatus(status);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState: OverviewState = {
  overview: {
    totalEmployees: 0,
    dayOffToday: 0,
    notification: 0,
  },
  agenda: [],
  isLoading: false,
  statusInfo: null,
};

const overviewSlice = createSlice({
  name: 'admin/overview',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // getTotalEmployee
    builder.addCase(getTotalEmployee.pending, state => {
      state.isLoading = true;
    });

    builder.addCase(getTotalEmployee.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.overview.totalEmployees = action.payload.listEmployee.length;
    });

    builder.addCase(getTotalEmployee.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = action.payload;
    });

    // getDayOfToday
    builder.addCase(getDayOfToday.pending, state => {
      state.isLoading = true;
    });

    builder.addCase(getDayOfToday.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.overview.dayOffToday = action.payload.total;
    });

    builder.addCase(getDayOfToday.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = action.payload;
    });

    // getNotification
    builder.addCase(getNotification.pending, state => {
      state.isLoading = true;
    });

    builder.addCase(getNotification.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.overview.notification = action.payload.total;
      state.agenda = action.payload.result;
    });

    builder.addCase(getNotification.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = action.payload;
    });
  },
});

export const selectOverview = (state: RootState) => state.overview;

const { reducer: overviewReducer } = overviewSlice;

export default overviewReducer;
