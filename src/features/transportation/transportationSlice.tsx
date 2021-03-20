import { createSlice } from '@reduxjs/toolkit';
import {ETADateInformation} from "./provider/Provider";


export interface TransportationState{
  etaList: ETADateInformation[]
}


export const transportationSlice = createSlice({
  name: 'transportation',
  initialState: {
    etaList: []
  },
  reducers: {
    updateETAList: (state, action) => {
      state.etaList = action.payload;
    },

  },
});

export const { updateETAList} = transportationSlice.actions;
export default transportationSlice.reducer;
