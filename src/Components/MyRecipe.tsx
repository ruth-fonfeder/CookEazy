import React, { useReducer, useEffect, useContext } from "react";
import { Card, Typography, Grid, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../userContext";

// Reducer
const initialState = { recipes: [], loading: true, error: null };

const recipeReducer = (state: any, action: any): any => {
  switch (action.type) {
    case "SET_RECIPES":
      return { ...state, recipes: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Styled components
const StyledCard = styled(Card)(() => ({
  backgroundColor: "white",
  color: "black",
  padding: "10px",
  borderRadius: "16px",
  boxShadow: "0px -4px 15px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  marginBottom: "2px",
  overflow: "auto",
  position: "relative",
}));

const StyledImg = styled("img")({
  width: "100%",
  maxHeight: "2000px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "1px",
});

const StyledTypography = styled(Typography)(() => ({
  color: "#f50380",
  fontWeight: "bold",
  fontSize: "24px",
  marginBottom: "10px",
}));

const PageContainer = styled(Box)(() => ({
  backgroundColor: "#f9f9f9",
//   minHeight: "100vh",
  padding: "2px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const ButtonContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  width: "200px",
  marginTop: "20px",
}));

// עמוד MyRecipe
const MyRecipe = () => {
  const { MyUser } = useContext(userContext);
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const response = await axios.get("http://localhost:8080/api/recipe");
        // סינון לפי המשתמש הנוכחי
        const myRecipes = response.data.filter(
          (r: any) => r.UserId === MyUser?.Id
        );
        dispatch({ type: "SET_RECIPES", payload: myRecipes });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch recipes" });
        console.error(error);
      }
    };
    fetchMyRecipes();
  }, [MyUser]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("בטוחה שאת רוצה למחוק את המתכון?")) return;

    try {
      await axios.post(`http://localhost:8080/api/recipe/delete/${id}`);
      dispatch({
        type: "SET_RECIPES",
        payload: state.recipes.filter((r: any) => r.Id !== id),
      });
      alert("המתכון נמחק!");
    } catch (err) {
      console.error(err);
      alert("שגיאה במחיקה");
    }
  };

  if (!MyUser) {
    return (
      <PageContainer>
        <Typography>אנא התחברי כדי לראות את המתכונים שלך</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography variant="h4" sx={{ marginBottom: "20px", color: "#f50380" }}>
        המתכונים שלי
      </Typography>

      {state.loading ? (
        <Typography>Loading...</Typography>
      ) : state.error ? (
        <Typography color="error">{state.error}</Typography>
      ) : state.recipes.length === 0 ? (
        <Typography>אין לך מתכונים שנוצרו</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: "100%" }}>
          {state.recipes.map((recipe: any) => (
            <Grid item key={recipe.Id} xs={12} sm={6} md={4} lg={4}>
              <StyledCard>
                <StyledTypography>{recipe.Name}</StyledTypography>
                <StyledImg src={recipe.Img} alt={recipe.Name} />
                <Typography variant="body1" sx={{ marginBottom: "15px" }}>
                  {recipe.Description}
                </Typography>
                <Typography sx={{ marginBottom: "15px", display: 'inline' }}>
                  ⏳ {recipe.Duration} min | 🔥 {recipe.Difficulty}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f50380" }}>
                  Ingredients:
                </Typography>
                {recipe.Ingridents.map((ing: any, index: number) => (
                  <Typography key={index}>
                    {ing.Count} {ing.Type} {ing.Name}
                  </Typography>
                ))}

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f50380", marginTop: "15px" }}>
                  Instructions:
                </Typography>
                {recipe.Instructions.map((inst: any, index: number) => (
                  <Typography key={index}>
                    {index + 1}. {inst.Name}
                  </Typography>
                ))}

                <ButtonContainer>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/UpdateRecipe/${recipe.Id}`)}
                  >
                    Update
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(recipe.Id)}
                  >
                    Delete
                  </Button>
                </ButtonContainer>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
};

export default MyRecipe;


