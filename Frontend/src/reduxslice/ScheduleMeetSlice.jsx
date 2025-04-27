import { createSlice } from "@reduxjs/toolkit";

export const ScheduleMeetSlice = createSlice({
  name: "schedule",
  initialState: {
    patient:[],
    doctor:[],
    appointment:[]
  },
  reducers: {
    appointmentDetails: (state, action) => {
      state.patient.push(action.payload.patient);
      state.doctor.push(action.payload.doctor);
      state.appointment.push(action.payload.appointment);

      },
  },
});

export const {appointmentDetails } = ScheduleMeetSlice.actions;

export default ScheduleMeetSlice.reducer;
