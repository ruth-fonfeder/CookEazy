// import React from "react";
// import { Link } from "react-router-dom";
// import { Button, Typography, Container, Box } from "@mui/material"; // רכיבים מ-MUI
// import { styled } from "@mui/system"; // לתמיכה בעיצוב עם MUI

// // עיצוב תמונה מתחלפת עם MUI
// const ImageContainer = styled(Box)({
//   width: '100%',
//   height: '300px',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   overflow: 'hidden',
//   marginBottom: '30px',
//   position: 'relative',
// });

// // רכיב תמונה מתחלפת
// const CakeImage = styled('img')({
//   width: '100%',
//   height: '100%',
//   objectFit: 'cover',
//   animation: 'imageSlide 10s infinite alternate',
// });

// // אנימציה לתמונה מתחלפת
// const style = {
//   '@keyframes imageSlide': {
//     '0%': {
//       transform: 'scale(1.1)',
//     },
//     '100%': {
//       transform: 'scale(1)',
//     },
//   },
// };

// const Home = () => {
//   return (
//     <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//       <ImageContainer sx={style}>
//         <CakeImage src="https://source.unsplash.com/1600x900/?cake" alt="cake" />
//       </ImageContainer>

//       <Typography variant="h4" color="primary" sx={{ marginBottom: '20px' }}>
//         ברוכים הבאים לאתר המתכונים
//       </Typography>

//       <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
//         <Link to="/login" style={{ textDecoration: 'none' }}>
//           <Button variant="contained" color="primary" fullWidth>
//             התחבר
//           </Button>
//         </Link>

//         <Link to="/myrecipes" style={{ textDecoration: 'none' }}>
//           <Button variant="contained" color="secondary" fullWidth>
//             המתכונים שלי
//           </Button>
//         </Link>

//         <Link to="/allrecipes" style={{ textDecoration: 'none' }}>
//           <Button variant="contained" color="success" fullWidth>
//             לכל המתכונים
//           </Button>
//         </Link>

//         <Link to="/logout" style={{ textDecoration: 'none' }}>
//           <Button variant="contained" color="error" fullWidth>
//             יציאה
//           </Button>
//         </Link>
//       </Box>
//     </Container>
//   );
// };

// export default Home;

import React from "react";
import { Link } from "react-router-dom"; // ליבוא הקישורים
import "../Designs/SiginIn.css"; // עיצוב מותאם אישית

const Home = () => {
  return (
    <div className="home-container">
      <div className="image-container">
        <img
          className="cake-images"
          src="https://source.unsplash.com/1600x900/?cake"
          alt="cake"
        />
      </div>

      <div className="buttons-container">
        <h1>Wellcome to CookEazy  ✨</h1>

        <Link to="/Login" className="link-button">
          <button className="custom-button primary">התחבר 🤍</button>
        </Link>

        <Link to="/myrecipes" className="link-button">
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

