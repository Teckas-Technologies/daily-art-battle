import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-top ">
        <div className="footer-left">
          <div className="flex flex-row items-center gap-3">
            <img
              src="/images/logo.png"
              alt="GFXvs Logo"
              className="footer-logo"
            />
            <h2>GFXvs</h2>
          </div>
          <p>
            GFXvs is a platform where artists and audiences meet together. It's
            a battle platform where the artists upload their art pieces to the
            platform and the audiences can provide their vote for their
            favourite arts.
          </p>
        </div>

        <div className="footer-right">
          <div className="footer-column">
            <h3>Pages</h3>
            <ul>
              <li>
                <a href="#">Art Battles</a>
              </li>
              <li>
                <a href="#">Campaigns</a>
              </li>
              <li>
                <a href="#">Leaderboard</a>
              </li>
              <li>
                <a href="#">Connect Wallet</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Art Battle</h3>
            <ul>
              <li>
                <a href="#">Upcoming Art Battles</a>
              </li>
              <li>
                <a href="#">Previous Art Battles</a>
              </li>
              <li>
                <a href="#">GFX Points</a>
              </li>
              <li>
                <a href="#">NFT Rewards</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Useful Links</h3>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <h3>Copyright GFXvs 2024</h3>
          <p>All rights reserved</p>
        </div>

        <div className="footer-bottom-right">
          <div className="footer-icon-container">
            <h2>Social Media links</h2>
            <ul className="social-icons">
              <li>
                <a href="#">
                  <img src="/images/telegram.png" alt="telegram" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/images/twitter.png" alt="Twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/images/insta.png" alt="Instagram" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/images/facebook.png" alt="facebook" />
                </a>
              </li>
            </ul>
          </div>
          <h3>Mail us : founders@gfxvs.com</h3>
        </div>
      </div>
    </div>
  );
};

export default Footer;
