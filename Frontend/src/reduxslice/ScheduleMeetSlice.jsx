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
    removeMeet: (state, action) => {
      state.meetDetails = state.meetDetails.filter(
        (item) => item.appointmentID !== action.payload
      );
    },
  },
});

export const {appointmentDetails, removeMeet } = ScheduleMeetSlice.actions;

export default ScheduleMeetSlice.reducer;
