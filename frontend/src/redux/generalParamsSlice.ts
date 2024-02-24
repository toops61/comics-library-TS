import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ParamsStateType {
    isLoading?: boolean;
    connected?: boolean;
    alertVisible?: boolean;
    alertMessage?: string;
    alertType?: string;
}

const initialState: ParamsStateType = {
    isLoading: false,
    connected: false,
    alertVisible: false,
    alertMessage: '',
    alertType: ''
}

const generalParamsSlice = createSlice({
    name: "generalParams",
    initialState,
    reducers: {
        updateGeneralParams: (state,action: PayloadAction<ParamsStateType>) => {
            state = {...state,...action.payload};
            return state;
        }
    }
})

export const {updateGeneralParams} = generalParamsSlice.actions;

export default generalParamsSlice.reducer;