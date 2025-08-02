import "./style.css";

import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdPhone, MdEmail } from "react-icons/md";

export default function SocialContact() {
  return (
    <div className="header-container">
      <div className="contact-info">
        {/* <div className="contact-item">
          <MdPhone className="icon" />
          <span>+12 345 6789 0</span>
        </div>
        <div className="contact-item">
          <MdEmail className="icon" />
          <span>support@example.com</span>
        </div> */}
      </div>

      <div className="social-icons">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="social-icon" />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="social-icon" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="social-icon" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="social-icon" />
        </a>
      </div>
    </div>
  );
}
