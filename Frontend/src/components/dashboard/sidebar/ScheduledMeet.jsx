import React from 'react'
import { useSelector } from 'react-redux';

const ScheduledMeet = () => {
  const patient = useSelector((state) => state.schedule.patient);
  const doctor = useSelector((state) => state.schedule.doctor);
  const appointment = useSelector((state) => state.schedule.appointment);

  console.log("Patient from store:", patient);
  console.log("Doctor from store:", doctor);
  console.log("Appointment from store:", appointment);
  return (
    <div>
      hello
    </div>
  )
}

export default ScheduledMeet
