import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import adminReducer from '../features/Admin/adminSlice';
import agendaReducer from '../features/Admin/pages/Agenda/agendaSlice';
import employeesReducer from '../features/Admin/pages/Employees/employeesSlice';
import overviewReducer from '../features/Admin/pages/Overview/overviewSlice';
import settingReducer from '../features/Admin/pages/Setting/settingSlice';
import agendaDetailReducer from '../features/Admin/pages/AgendaDetail/agendaDetailSlice';
import authReducer from '../features/Auth/authSlice';
import loginReducer from '../features/Auth/Login/loginSlice';

const rootReducer = {
  admin: adminReducer,
  auth: authReducer,
  agenda: agendaReducer,
  employees: employeesReducer,
  overview: overviewReducer,
  setting: settingReducer,
  agendaDetail: agendaDetailReducer,
  login: loginReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
