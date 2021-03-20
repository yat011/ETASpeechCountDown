import { configureStore } from '@reduxjs/toolkit';
import transportationSlice from "../features/transportation/transportationSlice";

 const store = configureStore({
  reducer: {
    transportation: transportationSlice
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;