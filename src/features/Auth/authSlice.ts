import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Status } from '../../constants/type';

export type User = {
  email: string;
  password: string;
};

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  statusInfo: Status | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  statusInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {},
});

const { reducer: authReducer } = authSlice;

export const selectAuth = (state: RootState) => state.auth;

export default authReducer;
