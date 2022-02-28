import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getListAgendaById, updateStatus } from '../../../../apis/Agenda';
import { RootState } from '../../../../app/store';
import { Agenda } from '../Agenda/agendaSlice';

export interface AgendaDetailState {
  agenda: Agenda | null;
  isLoading: boolean;
  statusInfo: null | {
    error: number;
    message: string;
  };
}

const initialState: AgendaDetailState = {
  agenda: null,
  isLoading: false,
  statusInfo: null,
};

export const getAgendaById = createAsyncThunk(
  'admin/agenda-detail/fetch-agenda',
  async (agendaId: string, { rejectWithValue }) => {
    try {
      const response = await getListAgendaById(agendaId);
      const { data } = response;

      if (data != null) {
        const {
          _id,
          status,
          reason,
          dayoff,
          createdAt,
          name,
          startDate,
          endDate,
        } = data.result[0];

        const agenda: Agenda = {
          reason,
          status,
          name,
          createdAt,
          id: _id,
          dayoff,
          startDate,
          endDate,
        };

        return agenda;
      }

      return rejectWithValue('Data must be not null');
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const updateAgendaStatus = createAsyncThunk(
  'admin/agenda-detail/update-agenda',
  async (agendaId: string, { getState, rejectWithValue }) => {
    try {
      const { agendaDetail } = getState() as RootState;
      const { agenda } = agendaDetail;

      if (agenda != null) {
        const data = {
          ...agenda,
          status: true,
        };

        const response = await updateStatus(agendaId, data);
        return response.data;
      }

      return rejectWithValue('Agenda must be not null');
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

const agendaDetailSlice = createSlice({
  name: 'admin/agenda-detail',
  initialState,
  reducers: {
    cleanStatusInfo(states) {
      states.statusInfo = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getAgendaById.pending, states => {
      states.isLoading = true;
    });

    builder.addCase(getAgendaById.fulfilled, (states, { payload }) => {
      states.isLoading = false;
      states.agenda = payload;
    });

    builder.addCase(getAgendaById.rejected, (states, { payload }) => {
      states.isLoading = false;
    });

    builder.addCase(updateAgendaStatus.fulfilled, (states, { payload }) => {
      if (states.agenda != null) {
        states.agenda.status = true;

        states.statusInfo = {
          error: payload.status,
          message: 'update-success',
        };
      }
    });

    builder.addCase(updateAgendaStatus.rejected, (states, action: any) => {
      states.statusInfo = {
        error: action.payload.status,
        message: 'update-failed',
      };
    });
  },
});

const { reducer: agendaDetailReducer } = agendaDetailSlice;
const { cleanStatusInfo } = agendaDetailSlice.actions;

export { agendaDetailReducer as default, cleanStatusInfo };
