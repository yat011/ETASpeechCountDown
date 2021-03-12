import { configureStore } from '@reduxjs/toolkit';
import transportationSlice from "../features/transportation/transportationSlice";

export default configureStore({
  reducer: {
    transportation: transportationSlice
  },
});
