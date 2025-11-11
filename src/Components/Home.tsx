import React from "react";
import { Link } from "react-router-dom"; // ליבוא הקישורים
 import { Button, Typography, Container, Box } from "@mui/material"; // רכיבים מ-MUI
import { styled } from "@mui/system"; // לתמיכה בעיצוב עם MUI
//import "../Designs/SiginIn.css"; // עיצוב מותאם אישית

const Home = () => {
  return (
    <div className="home-container">
      <div className="image-container">
        {/* <img
          className="cake-images"
          src="https://source.unsplash.com/1600x900/?cake"
          alt="cake"
        /> */}
      </div>

      <div className="buttons-container">
        <h1>Wellcome to CookEazy  ✨</h1>

        <Link to="/Login" className="link-button">
          <button className="custom-button primary">התחבר 🤍</button>
        </Link>

        <Link to="/AddRecipe" className="link-button">
          <button className="custom-button secondary">המתכונים שלי 🤍</button>
        </Link>

        <Link to="/AllRecipes" className="link-button">
          <button className="custom-button success">לכל המתכונים 🤍</button>
        </Link>

        <Link to="/login" className="link-button">
          <button className="custom-button error">יציאה 🤍</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

