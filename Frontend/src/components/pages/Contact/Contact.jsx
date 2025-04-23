import  { useState, useRef } from 'react';
import './Contact.css';

import CONT_IMG from '../../../assets/images/contact.png';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Contact = () => {
  // State management for form inputs and loading state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // State for showing the pop-up box

  const popupRef = useRef(null); // Reference to the pop-up box element

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all fields');
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('https://healthcare-platform-server.vercel.app/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowMessage(true); // Show the pop-up box
        setLoading(false); // Reset loading state
        navigate('/thankyou'); // Redirect to a thank you page after success
      } else {
        const result = await response.json();
        alert(`Error: ${result.message || 'Failed to send message.'}`);
        setLoading(false); // Reset loading state
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Network error. Please try again later.');
      setLoading(false); // Reset loading state
    }
  };

  // Handle closing the pop-up box
  const handleClosePopup = () => {
    setShowMessage(false);
  };

  return (
    <div>
      

      <div className="contact-form">
        <form className="form-cont" onSubmit={handleSubmit}>
          <h1>Get in Touch</h1>
          <label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="cont-detail"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              className="cont-detail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <textarea
              name="message"
              placeholder="Enter Your Message"
              className="cont-detail"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader size={20} /> : 'Submit'}
          </button>
        </form>

        <div className="cont-img">
          <img src={CONT_IMG} alt="Contact us illustration" />
        </div>

        {/* Pop-up message when form is submitted */}
        {showMessage && (
          <div className="popup" ref={popupRef}>
            <p>Message sent successfully!</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
