import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./about.scss";

function AboutUs() {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero">
        <div className="overlay">
          <h1>Your Trusted Partner in Real Estate.</h1>
          <p>Buying, Selling, and Renting made easy and hassle-free.</p>
          {/* Use Link for navigation */}
          <Link to="/list">
            <button className="cta-button">Explore Properties</button>
          </Link>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="who-we-are">
        <div className="content">
          <div className="text">
            <h2>Who We Are</h2>
            <p>
              We are a team of passionate real estate professionals dedicated to
              simplifying property transactions. With years of experience, we
              provide innovative solutions tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="what-we-offer">
        <h2>What We Offer</h2>
        <div className="cards">
          <div className="card">
            <i className="icon house-icon" />
            <h3>Buy</h3>
            <p>
              Explore a wide range of properties and find your dream home with
              ease.
            </p>
          </div>
          <div className="card">
            <i className="icon price-tag-icon" />
            <h3>Sell</h3>
            <p>
              List your property and sell it quickly with our expert guidance.
            </p>
          </div>
          <div className="card">
            <i className="icon key-icon" />
            <h3>Rent</h3>
            <p>
              Discover rental properties that match your lifestyle and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>
        <div className="stats">
          <div className="stat">
            <h3>1000+</h3>
            <p>Properties Listed</p>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
          <div className="stat">
            <h3>75+</h3>
            <p>City Covered</p>
          </div>
        </div>
      </section>

      {/* Our Vision & Mission */}
      <section className="vision-mission">
        <h2>Our Vision & Mission</h2>
        <p>
          Our vision is to redefine real estate by offering seamless, transparent,
          and efficient services. We aim to empower our clients with the best tools
          and expertise to make informed decisions.
        </p>
      </section>

      {/* Meet the Team */}
      <section className="meet-the-team">
        <h2>Meet the Team</h2>
        <div className="team">
          <div className="member">
            <img src="/k.png" alt="Team Member" />
            <p>Kanchan Mainali - CEO</p>
          </div>
          <div className="member">
            <img src="/nilima.jpg" alt="Team Member" />
            <p>Nilima Mainali - CTO</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Join Us Now</h2>
        <p>Sign up today and experience the future of real estate.</p>
        {/* Use Link for navigation */}
        <Link to="/register">
          <button className="cta-button">Sign Up</button>
        </Link>
      </section>
    </div>
  );
}

export default AboutUs;