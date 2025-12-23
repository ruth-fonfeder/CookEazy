// import React from "react";
import React, { useContext } from "react";

import { Link } from "react-router-dom"; // ליבוא הקישורים
import { Button, Typography, Container, Box } from "@mui/material"; // רכיבים מ-MUI
import { styled } from "@mui/system"; // לתמיכה בעיצוב עם MUI
import { userContext } from "../userContext";

//import "../Designs/SiginIn.css"; // עיצוב מותאם אישית

const Home = () => {
  const { MyUser } = useContext(userContext);
  console.log("Home MyUser:", MyUser);
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
        {/* <h2>ברוכה הבאה {MyUser?.name}</h2> */}

        <h1>Welcome to CookEazy  ✨</h1>

        {/* <Link to="/Login" className="link-button">
          <button className="custom-button primary">התחבר 🤍</button>
        </Link> */}

        <Link to="/MyRecipe" className="link-button">
          <button className="custom-button secondary">המתכונים שלי 🤍</button>
        </Link>

        <Link to="/AllRecipes" className="link-button">
          <button className="custom-button success">לכל המתכונים 🤍</button>
        </Link>

        <Link to="/AllRecipes" className="link-button">
        <button className="custom-button primary">בחר לפי קטגוריה 🤍</button>
        </Link>
     
        <Link to="/AddRecipe" className="link-button">
          <button className="custom-button primary">הוספת מתכון ➕</button>
          </Link>
            <Link to="/login" className="link-button">
            <button className="custom-button error">יציאה 🤍</button>
          </Link>
      </div>
    </div>
  );
};

export default Home;

