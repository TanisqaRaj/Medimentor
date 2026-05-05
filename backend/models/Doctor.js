import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const doctorSchema = new mongoose.Schema(
    {
        doctorId: {
            type: String,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['doctor'],
            default: 'doctor',
        },
        name: { type: String, required: true },
        phone: {
            type: Number,
            required: true,
            match: /^[0-9]{10}$/,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        username: { type: String, required: true, unique: true },
        certificate: { type: String, required: true },
        bio: { type: String, required: true },
        image: { type: String, required: false },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other'],
        },
        rating: { type: Number, default: 4.5 },
        profession: { type: [String], required: true },
        experience: { type: Number, required: true },
        department: { type: String, required: true },
        fee: { type: Number, required: false, default: 500 },
        mciNumber: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        otp: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);

// Middleware to auto-generate doctor ID
doctorSchema.pre('save', async function () {
    if (!this.doctorId) {
        const departmentCode = this.department.slice(0, 3).toUpperCase();
        let newIdNumber = 1;
        let newDoctorId;

        do {
            newDoctorId = `${departmentCode}-${String(newIdNumber).padStart(4, '0')}`;
            const existingDoctor = await mongoose.model('Doctor').findOne({ doctorId: newDoctorId });
            if (!existingDoctor) break;
            newIdNumber++;
        } while (true);

        this.doctorId = newDoctorId;
    }
});

// Query indexes
doctorSchema.index({ department: 1 });
doctorSchema.index({ profession: 1 });
doctorSchema.index({ name: 'text', department: 'text', profession: 'text' });

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
