import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // Reference to the chosen doctor
      required: true,
    },

    meetingDetails: {
        meetingId: { type: String, required: false, unique: true },
        meetingPassword: { type: String, required: false },
        meetingUrl: { type: String, required: false },
        location: { type: String, required: false },
    }
  },
  {
    timestamps: true,
  }
);

contractSchema.pre('save', function (next) {
  if (!this.meetingDetails) this.meetingDetails = {};

  if (!this.meetingDetails.meetingId) {
    const date = new Date();
    this.meetingDetails.meetingId = `${this.appointmentId}${date.toISOString().replace(/[^0-9]/g, "")}`;
    console.log("Generated meeting ID:", this.meetingDetails.meetingId);
  }

  next();
});


export default mongoose.model("Contract", contractSchema);
