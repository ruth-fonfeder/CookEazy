import React, { useReducer } from "react";
import { Card, Typography, Grid, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import cakeImg from '../images/alex-munsell-auIbTAcSH6E-unsplash.jpg';

// מערך המתכונים
const recipesData = [
  {
    Id: 1,
    Name: "Chocolate Cake",
    Instructions: [{ Name: "Mix ingredients, bake for 30 min" }],
    Difficulty: "medium",
    Duration: 60,
    Img:cakeImg,
    Ingridents: [
      { Name: "Flour", Count: 2, Type: "Cups" },
      { Name: "Sugar", Count: 1, Type: "Cup" },
    ],
    UserId: 101,
    CategoryId: 5,
    Description: "A delicious chocolate cake recipe.",
  },
  {
    Id: 2,
    Name: "Pasta Carbonara",
    Instructions: [{ Name: "Cook pasta, mix with sauce" }],
    Difficulty: "low",
    Duration: 30,
    Img: "https://source.unsplash.com/800x400/?pasta",
    Ingridents: [
      { Name: "Pasta", Count: 1, Type: "Pack" },
      { Name: "Eggs", Count: 2, Type: "Pieces" },
    ],
    UserId: 102,
    CategoryId: 3,
    Description: "Classic Italian pasta dish.",
  },
];

// Reducer
const initialState = { recipes: recipesData };
const recipeReducer = (state: any, action: any): any => {
  switch (action.type) {
    default:
      return state;
  }
};

// עיצוב הכרטיסים
const StyledCard = styled(Card)(() => ({
  backgroundColor: "white",
  color: "black",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  width: "100%", // כרטיס יתפוס את כל רוחב חצי עמוד
  height: "500px", // גובה אחיד לכל כרטיס
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
}));

// עיצוב התמונה
const StyledImg = styled("img")({
  width: "100%",
  maxHeight: "250px",
  objectFit: "cover",
  borderRadius: "12px",
});

// עיצוב הכותרת
const StyledTypography = styled(Typography)(() => ({
  color: "#f50380",
  fontWeight: "bold",
  fontSize: "26px",
}));

const PageContainer = styled(Box)(() => ({
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
  padding: "40px 0",
  display: "flex",
  justifyContent: "center",
}));

// כפתורים
const ButtonContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: "20px",
}));

const AllRecipes = () => {
  const [state] = useReducer(recipeReducer, initialState);

  return (
    <PageContainer>
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: "1200px" }}>
        {state.recipes.map((recipe: any) => (
          <Grid item key={recipe.Id} xs={12} sm={6} md={6}> {/* כרטיסים שניים בכל שורה */}
            <StyledCard>
              <StyledTypography>{recipe.Name}</StyledTypography>
              <StyledImg src={recipe.Img} alt={recipe.Name} />
              <Typography variant="body1" sx={{ margin: "10px 0" }}>
                {recipe.Description}
              </Typography>
              <Typography>⏳ {recipe.Duration} min | 🔥 {recipe.Difficulty}</Typography>
              <Typography variant="h6" sx={{ marginTop: "10px", fontWeight: "bold", color: "#f50380" }}>
                Ingredients:
              </Typography>
              {recipe.Ingridents.map((ing: any, index: number) => (
                <Typography key={index}>
                  {ing.Count} {ing.Type} {ing.Name}
                </Typography>
              ))}
              <Typography variant="h6" sx={{ marginTop: "10px", fontWeight: "bold", color: "#f50380" }}>
                Instructions:
              </Typography>
              {recipe.Instructions.map((inst: any, index: number) => (
                <Typography key={index}>
                  {index + 1}. {inst.Name}
                </Typography>
              ))}
              <ButtonContainer>
                <Button variant="contained" color="primary" size="small">
                  Update
                </Button>
                <Button variant="outlined" color="secondary" size="small">
                  Delete
                </Button>
              </ButtonContainer>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default AllRecipes;

