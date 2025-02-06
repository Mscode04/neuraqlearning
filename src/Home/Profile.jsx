import React, { useState } from "react";
import "./Profile.css"; // Import the CSS file
import { db } from "../Firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { FaStar } from "react-icons/fa"; // Import star icons from react-icons

const Profile = ({ patientId, userName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback || rating === 0) {
      alert("Please provide both a rating and feedback.");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        patientId,
        userName,
        rating,
        feedback,
        timestamp: new Date(),
      });
      alert("Feedback submitted successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="pro-container">
      <h1 className="pro-heading">
        Profile <h1>{userName}</h1>
      </h1>

      {/* Feedback Button */}
      <button className="feedback-button" onClick={handleOpenModal}>
        Leave Feedback
      </button>

      {/* Contact Details Section */}
      <div className="pro-section">
        <h2 className="pro-section-heading">Contact Details</h2>
        <ul className="pro-list">
          <li className="pro-list-item">
            <strong>Email:</strong> example@example.com
          </li>
          <li className="pro-list-item">
            <strong>Phone:</strong> +123 456 7890
          </li>
          <li className="pro-list-item">
            <strong>Address:</strong> 123 Main St, City, Country
          </li>
        </ul>
      </div>

      {/* Terms and Conditions Section */}
      <div className="pro-section">
        <h2 className="pro-section-heading">Terms and Conditions</h2>
        <p className="pro-text">
          By using this platform, you agree to our terms and conditions. Please
          read them carefully.
        </p>
        <ul className="pro-list">
          <li className="pro-list-item">
            You must be at least 18 years old to use this service.
          </li>
          <li className="pro-list-item">
            All content provided is for educational purposes only.
          </li>
          <li className="pro-list-item">
            We reserve the right to modify these terms at any time.
          </li>
        </ul>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Leave Feedback</h2>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="star"
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleStarClick(ratingValue)}
                  />
                );
              })}
            </div>
            <textarea
              className="feedback-input"
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button onClick={handleSubmitFeedback}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;