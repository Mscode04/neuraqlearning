import React, { useState, useEffect } from "react";
import { db } from "../Firebase/config"; // Your Firebase config file
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Home({ patientId, userName, userGender }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0); // Track the current feedback index
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const querySnapshot = await getDocs(collection(db, "feedbacks"));
      const feedbacksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(feedbacksData);
    };

    fetchFeedbacks();
  }, []);

  // Automatically cycle through feedbacks every 3 seconds
  useEffect(() => {
    if (feedbacks.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeedbackIndex((prevIndex) =>
          (prevIndex + 1) % feedbacks.length
        );
      }, 4000); // Change feedback every 3 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [feedbacks]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  // Determine the avatar URL based on the userGender prop
  const getAvatarUrl = () => {
    if (userGender === "Male") {
      return "output-onlinegiftools.gif";
    } else if (userGender === "Female") {
      return "https://media2.giphy.com/avatars/bronandco/YxpMgT87kdpb.gif";
    } else {
      return "https://media.lordicon.com/icons/wired/outline/21-avatar.gif";
    }
  };

  return (
    <div className="HomeApp">
      {/* Topbar */}
      <header className="HomeTopbar">
        <button className="btn btn-transparent" onClick={toggleDrawer}>
          <i className="bi bi-list"></i>
        </button>
        <div className="user-info">
          <span>{userName}</span>
          <img
            src={getAvatarUrl()} // Use the getAvatarUrl function to set the avatar
            alt="User Avatar"
            className="user-avatar"
          />
        </div>
      </header>

      {/* Drawer */}
      <div className={`HomeDrawer ${drawerOpen ? "open" : ""}`}>
        <button className="HomeDrawerCloseButton" onClick={toggleDrawer}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="drawer-content">
          <a
            href="https://neuraq.github.io/Palliative-Mkba-App-Contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="HomeDrawerButton"
          >
            Contact Us
          </a>
          <a
            href="https://neuraq.github.io/Palliative-Mkba-App-About/"
            target="_blank"
            rel="noopener noreferrer"
            className="HomeDrawerButton"
          >
            About Us
          </a>
        </div>
        <div className="drawer-footer">
          <button className="HomeDrawerButton btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <div className="powered-by">Powered by neuraq</div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="HomeBanner">
        <h1>WELCOME {userName}</h1>
        <p>Your one-stop destination for all study materials!</p>
      </div>

      {/* Testimonials Section */}
<div className="HomeTestimonials">
  <h2>What Our Users Say</h2>
  <div className="testimonial-grid container">
    {feedbacks.length > 0 && (
      <div
        className={`testimonial-card slide-animation`}
        key={feedbacks[currentFeedbackIndex].id}
      >
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/df7eac147767277.62c848d68fa9d.gif"
          alt="User"
          className="testimonial-avatar"
        />
        <div className="rating">
          <p>{feedbacks[currentFeedbackIndex].feedback} <span>- {feedbacks[currentFeedbackIndex].userName}</span></p>
          {Array.from({ length: feedbacks[currentFeedbackIndex].rating }, (_, i) => (
            <i key={i} className="bi bi-star-fill"></i>
          ))}
        </div>
      </div>
    )}
  </div>
</div>


      {/* Footer */}
      <footer className="HomeFooter">
        <p>&copy; 2023 Neuraq. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;