import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import "../styles/main.css";

export default function Footer() {
  return (
    <div className="footer">
      <img src="https://myqnstartup.com/wp-content/uploads/2022/02/MyStartup_LogoORNGRY.png" />
      <span>Copyright © 2022 My-Start-Up | Powered by GemStone</span>
      <div class="footer-links">
        <FaLinkedin cursor="pointer" color="#a218d9" fontSize="1.5em" />
        <FaFacebook cursor="pointer" color="#a218d9" fontSize="1.5em" />
        <FaTwitter cursor="pointer" color="#a218d9" fontSize="1.5em" />
      </div>
    </div>
  );
}
