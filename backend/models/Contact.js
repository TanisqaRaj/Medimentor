// models/Contact.js
import mongoose from 'mongoose';

// Define the contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the Contact model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
