import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENGINE_METHOD_ALL } from 'constants';
import { RootState } from '../../app/store';
import {convertToDateETA, ETADateInformation, ETAStringInformation} from "./provider/Provider";


export interface TransportationState{
   etaList: ETAStringInformation[]
}

const initialState:TransportationState = {
   etaList: []
}

export const transportationSlice = createSlice({
  name: 'transportation',
  initialState,
  reducers: {
    updateETAList: (state, action:PayloadAction<ETAStringInformation[]>) => {
      state.etaList = action.payload;
    },

  },
});

export const { updateETAList} = transportationSlice.actions;
export const selectETAList = (state: RootState) =>{
  const etaList = state.transportation.etaList ;
  return convertToDateETA(etaList);
}
export default transportationSlice.reducer;
