import React, { useState } from "react";
import "../componentStyles/Rating.css";
const Ratings = ({ value, onRatingChange, disabled }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  // handling hovering the star(rating)
  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  // handle click
  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      // for parent component
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  // generating stars based on selected rating
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i <= (hoveredRating || selectedRating);
      // till hovered rating stars are marked with filled, else with empty class
      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "filled" : "empty"}`}
          onMouseEnter={() => handleMouseEnter}
          onMouseLeave={() => handleMouseLeave}
          onClick={() => handleClick}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  return (
    <div>
      <div className="rating">{generateStars()}</div>
    </div>
  );
};

export default Ratings;
