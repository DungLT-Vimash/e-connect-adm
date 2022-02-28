import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getDarkMode = () => {
  const darkMode = localStorage.getItem('darkMode');

  if (darkMode === 'true') {
    return true;
  }

  localStorage.setItem('darkMode', 'false');
  return false;
};

const initialState = {
  darkMode: getDarkMode(),
};

const settingSlice = createSlice({
  name: 'admin/setting',
  initialState,
  reducers: {
    setDarkMode(states, action: PayloadAction<boolean>) {
      const { payload } = action;
      states.darkMode = payload;
      localStorage.setItem('darkMode', payload ? 'true' : 'false');
    },
  },
});

const { setDarkMode } = settingSlice.actions;
const { reducer: settingReducer } = settingSlice;

export { settingReducer as default, setDarkMode };
