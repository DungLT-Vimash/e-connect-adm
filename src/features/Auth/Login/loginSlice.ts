import {
  createAsyncThunk,
  createSlice,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { login } from '../../../apis/Login';
import { setTokenService, setRefreshTokenService } from './token';

export interface LoginInterface {
  phoneNumber: string;
  password: string;
}
export interface LoginState {
  login: LoginInterface[];
  message: string;
  isLoading: boolean;
}
export const initialState: LoginState = {
  login: [],
  message: '',
  isLoading: false,
};
const middleWare = getDefaultMiddleware({
  serializableCheck: false,
});

export const handleLogin = createAsyncThunk(
  'login',
  async (data: any, { rejectWithValue }) => {
    try {
      const res: any = await login(data);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(handleLogin.pending, state => {});
    builder.addCase(handleLogin.fulfilled, (state, { payload }) => {
      state.isLoading = !state.isLoading;
      state.message = payload.data.message;
      setTokenService(payload.data.access_token);
      setRefreshTokenService(payload.data.refresh_token);
    });
    builder.addCase(handleLogin.rejected, (state, action: any) => {
      state.isLoading = false;
      state.message = action.error.message;
    });
  },
});

export const selectLogin = (state: RootState) => state.login;
const { reducer: loginReducer } = loginSlice;
export default loginReducer;
