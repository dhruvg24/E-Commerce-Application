import React from "react";
import "../componentStyles/Footer.css";
import { Phone, Mail, LinkedIn, GitHub } from "@mui/icons-material";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* {Section 1} */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p fontSize="small">
            <Phone />
            Phone: +91-9461484088
          </p>
          <p>
            <Mail />
            Email: dhruv02.work@gmail.com
          </p>
        </div>

        {/* Section 2 */}
        <div className="footer-section social">
          <h3>Follow me</h3>
          <div className="social-links">

            <a href="https://github.com/dhruvg24/" target="blank">
              <GitHub className="social-icon" />
            </a>
            <a href="https://www.linkedin.com/in/dhruv-garg-dg/" target="blank">
              <LinkedIn className="social-icon" />
            </a>{" "}
            
            
          </div>
        </div>

        {/* Section 3 */}
        <div className="footer-section about">
            <h3>About</h3>
            <p>A dedicated developer, constantly learning new technologies and building projects. Believer in consistent effort and growth.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Dhruv Garg. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
