import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getLocalStorage, setLocalStorage } from '../../util';
import { Deadline } from './Deadline';

const KEY_NAME='deadline'
export interface DeadlineState{
    deadlineList: Deadline[];
    currentDeadline: Deadline|null
}

const initialState: DeadlineState = {
    deadlineList: (getLocalStorage(KEY_NAME) || []),
    currentDeadline: null
}

const deadlineSlice = createSlice({
    name:KEY_NAME,
    initialState,
    reducers: {
        updateDeadlineList: (state, action:PayloadAction<Deadline[]>) => {
            state.deadlineList = action.payload;
            setLocalStorage(KEY_NAME, action.payload);
        },
        updateCurrentDeadline: (state, action:PayloadAction<Deadline>) => {
            state.currentDeadline = action.payload;
        }
    }
})

export const {updateDeadlineList, updateCurrentDeadline} = deadlineSlice.actions;
export const selectDeadlineList = (state:RootState) => {
    return state.deadline.deadlineList;
}

export const selectCurrentDeadline = (state:RootState) => {
    return state.deadline.currentDeadline;
}


export default deadlineSlice.reducer;
