import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientContact: { type: String, required: true },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    age: { type: Number, required: true },
    title:{type: String, required: true},
    desc: { type: String, required: true },
    state: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    expectedDate: { type: Date, required: true },
    patientAddress: { type: String, required: true },
    disease: { type: String, required: false},
    patientEmail: { type: String, required: true },
    mode: {
        type: String,
        required: true,
        enum: ['online', 'offline']
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Reference to the chosen doctor
        required: true
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who booked the appointment
        required: true
    },
    appointmentID: {
        type: String,
        unique: true
    },
}, {
    timestamps: true
});

// Generate a unique appointment ID using the doctor's department code
appointmentSchema.methods.generateAppointmentID = async function () {
    const doctor = await mongoose.model('Doctor').findById(this.doctorID);  
    const departmentCode = doctor.department.slice(0, 3).toUpperCase(); // First three letters of department
    const date = this.expectedDate.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const randomNumber = Math.floor(10 + Math.random() * 90); // Random 2-digit number
    this.appointmentID = `${departmentCode}${date}${randomNumber}`;
};

// Query indexes
appointmentSchema.index({ patientID: 1, expectedDate: 1 });
appointmentSchema.index({ doctorID: 1, state: 1 });
appointmentSchema.index({ state: 1 });

export default mongoose.model('Appointment', appointmentSchema);