import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const doctorSchema = new mongoose.Schema(
    {
        doctorId: {
            type: String,
            unique: true,
        }, // Auto-generated ID based on department
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
            match: /^[0-9]{10}$/, // Ensures a valid 10-digit phone number
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        username: { type: String, required: true, unique: true }, // Unique username
        certificate: { type: String, required: true }, // Certificate upload (URL or file path)
        bio: { type: String, required: true }, // Short biography
        image: { type: String, required: false }, // Profile picture (URL or file path)
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other'],
        },
        rating: { type: Number, default: 4.5 },
        profession:{type:[String],required:true},
        experience: { type: Number, required: true }, // Experience in years
        department: { type: String, required: true }, // Profession (e.g., General Physician, Surgeon)
        fee:{type:Number, required: false,default: 500},
        mciNumber: { type: String, required: true, unique: true }, // Unique Medical Council of India number
        password: { type: String, required: true, minlength: 6 }, // Encrypted password
    },
    { timestamps: true }
);

// Middleware to auto-generate doctor ID
doctorSchema.pre('save', async function (next) {
    if (!this.doctorId) {
        const departmentCode = this.department.slice(0, 3).toUpperCase(); // First 3 letters of department
        let newIdNumber = 1;
        let newDoctorId;

        // Loop to ensure unique doctorId
        do {
            newDoctorId = `${departmentCode}-${String(newIdNumber).padStart(4, '0')}`; // Format: DEP-0001
            const existingDoctor = await mongoose.model('Doctor').findOne({ doctorId: newDoctorId });
            if (!existingDoctor) break;
            newIdNumber++;
        } while (true);

        this.doctorId = newDoctorId;
    }
    next();
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;