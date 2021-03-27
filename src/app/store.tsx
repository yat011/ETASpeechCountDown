import { configureStore } from '@reduxjs/toolkit';
import deadlineSlice from '../features/deadline/deadlineSlice';
import transportationSlice from "../features/transportation/transportationSlice";
 const store = configureStore({
  reducer: {
    transportation: transportationSlice,
    deadline: deadlineSlice
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;