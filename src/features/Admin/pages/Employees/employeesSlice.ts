import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import employeesApi, { IPage } from '../../../../apis/employeesApi';
import { RootState } from '../../../../app/store';
import { IGetEmployee } from './Employees';
import { IEmployee } from './pages/CreateEmployee/CreateEmployee';

type Status = {
  status: number;
  msg: string;
};

type Author = {
  id: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
};

export interface IStatusInfo {
  returnCode: number;
  author: Author;
  createdAt: any;
  statusCretead: boolean;
  status: boolean;
  joinedDate: any;
}

export interface EmployeeState {
  employees: IGetEmployee[];
  employee: IGetEmployee | null;
  isLoading: boolean;
  statusInfo: Status | null;
  totalEmployees: number;
  statusInfoEmployee: IStatusInfo | null;
  isUpdate: boolean;
}

export interface dataAsynAction {
  id: string | undefined;
  data: IEmployee;
}

export interface IFilter {
  page: IPage;
  limit: IPage;
  phoneNumber: string | undefined;
  status: boolean | undefined;
  name: string | undefined;
}

export const getEmployees = createAsyncThunk(
  'admin/employees/getEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const res: any = await employeesApi.getListEmployees();
      return res.data.listEmployee;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const getEmployeeByIdSlice = createAsyncThunk(
  'admin/employees/getEmployeeById',
  async (id: string | undefined, { rejectWithValue }) => {
    try {
      const res: any = await employeesApi.getEmployeeById(id);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'admin/employees/createEmployee',
  async (data: IEmployee, { rejectWithValue }) => {
    try {
      const res = await employeesApi.createNewEmployee(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'admin/employees/updateEmployee',
  async ({ id, data }: dataAsynAction, { rejectWithValue }) => {
    try {
      const res = await employeesApi.updateEmployee(id, data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const getFilterEmployees = createAsyncThunk(
  'admin/employees/getFilterEmployees',
  async (data: string, { rejectWithValue }) => {
    try {
      const res = await employeesApi.getListFilterEmployee(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const resetPasswordEmployee = createAsyncThunk(
  'admin/employees/resetPasswordEmployee',
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      const res = await employeesApi.resetPassword(id, data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const getStatusInfoEmployee = createAsyncThunk(
  'admin/employees/getStatusInfoEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await employeesApi.getStatusInfo(id);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export const updateStatusInfoEmployee = createAsyncThunk(
  'admin/employees/updateStatusInfoEmployee',
  async (
    { id, data }: { id: string; data: { createdDate: Date | string } },
    { rejectWithValue }
  ) => {
    try {
      const res = await employeesApi.updateStatusEmployee(id, data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

const initialState: EmployeeState = {
  employees: [],
  employee: null,
  isLoading: true,
  statusInfo: null,
  totalEmployees: 0,
  statusInfoEmployee: null,
  isUpdate: false,
};

const employeesSlice = createSlice({
  name: 'admin/employees',
  initialState,
  reducers: {
    clearIsUpdate(state, action) {
      state.isUpdate = action.payload;
    },
    clearStatusInfo(state) {
      state.statusInfo = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getEmployees.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getEmployees.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.employees = payload;
    });
    builder.addCase(getEmployees.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(getEmployeeByIdSlice.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeByIdSlice.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.employee = payload;
    });
    builder.addCase(getEmployeeByIdSlice.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(createEmployee.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(createEmployee.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.statusInfo = payload;
    });
    builder.addCase(createEmployee.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(updateEmployee.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateEmployee.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.statusInfo = payload;
    });
    builder.addCase(updateEmployee.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(getFilterEmployees.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getFilterEmployees.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.employees = payload.result;
      state.totalEmployees = payload.searched;
    });
    builder.addCase(getFilterEmployees.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(resetPasswordEmployee.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(resetPasswordEmployee.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.statusInfo = {
        status: payload.status,
        msg: payload.data.message,
      };
      state.isUpdate = true;
    });
    builder.addCase(resetPasswordEmployee.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(getStatusInfoEmployee.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStatusInfoEmployee.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.statusInfoEmployee = payload;
    });
    builder.addCase(getStatusInfoEmployee.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });

    builder.addCase(updateStatusInfoEmployee.pending, state => {
      state.statusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(
      updateStatusInfoEmployee.fulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.statusInfo = {
          status: payload.status,
          msg: 'Updated successfully!',
        };
        state.isUpdate = true;
      }
    );
    builder.addCase(updateStatusInfoEmployee.rejected, (state, action: any) => {
      state.isLoading = false;
      state.statusInfo = {
        status: action.payload.status,
        msg: action.payload.data.message,
      };
    });
  },
});

export const selectEmployees = (state: RootState) => state.employees;

const { reducer: employeesReducer, actions } = employeesSlice;

export const { clearIsUpdate, clearStatusInfo } = actions;

export default employeesReducer;
