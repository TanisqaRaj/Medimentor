import { createSlice } from "@reduxjs/toolkit";

export const ScheduleMeetSlice = createSlice({
  name: "schedule",
  initialState: {
    meetDetails:[]
  },
  reducers:{
    appointmentDetails: (state, action) => {
      state.meetDetails = action.payload; 
    },
  },
});

export const {appointmentDetails } = ScheduleMeetSlice.actions;

export default ScheduleMeetSlice.reducer;
