import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.js';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {},
  reducers: {},
  extraReducers: {},
});

const { reducer: adminReducer } = adminSlice;

export const selectAdmin = (state: RootState) => state.admin;

export default adminReducer;
