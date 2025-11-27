//מתכונים מהשרת
import React, { useReducer, useEffect, useContext } from "react";
import { Card, Typography, Grid, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import { data, useNavigate } from "react-router-dom"; // בשביל הניווט
import axios from 'axios'; // ייבוא axios
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

const StyledCard = styled(Card)(() => ({
  backgroundColor: "white",
  color: "black",
  padding: "2px", // הגדר padding סביר שייתן מקום לכל התוכן
  borderRadius: "16px",
  boxShadow: "0px -4px 15px rgba(0, 0, 0, 0.2)", // box-shadow למעלה
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  // minHeight: "50px", // גובה קבוע
  marginBottom: "20px",
  overflow: "auto", // בגלילה בתוכן ארוך
  position: "relative",
}));

// עיצוב התמונה
const StyledImg = styled("img")({
  width: "100%",
  maxHeight: "250px", // שינוי גובה התמונה כדי להשאיר מקום לתוכן
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "15px", // יצירת מרווח בין התמונה לתוכן
});

// עיצוב הכותרת
const StyledTypography = styled(Typography)(() => ({
  color: "#f50380",
  fontWeight: "bold",
  fontSize: "24px", // שינוי גודל הטקסט
  marginBottom: "10px", // מרווח בין הכותרת לשאר התוכן
}));

const PageContainer = styled(Box)(() => ({
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
  padding: "40px ",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "1000 px",
}));

// כפתורים
const ButtonContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  width: "200px",
  marginTop: "20px",
}));

// כפתור הוספת מתכון
const AddRecipeButton = styled(Button)(() => ({
  position: "absolute",
  top: "40px",
  right: "240px",
  backgroundColor: "#f50380",
  color: "white",
  fontSize: "12px",
  height: "45px",
  width: "100px",
  borderRadius: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1E88E5",
    color: "white",
  },
}));

const AllRecipes = () => {
  let header: Boolean = false;
  const { MyUser } = useContext(userContext)
  if (MyUser)
    header = true
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const navigate = useNavigate(); // לשימוש בניווט

  useEffect(() => {
    const fetchRecipes = async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const response = await axios.get("http://localhost:8080/api/recipe");
        dispatch({ type: "SET_RECIPES", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch recipes" });
        console.error(error);
      }
    };
    fetchRecipes();
  }, []);
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
  
  
  return (
    <PageContainer>
      {/* כפתור הוספת מתכון */}
      <AddRecipeButton
        onClick={() => navigate("/AddRecipe")}
        disabled={!header} // הכפתור יושבת אם התנאי לא מתקיים
      >
        ➕ Add Recipe
      </AddRecipeButton>

      {state.loading ? (
        <Typography>Loading...</Typography>
      ) : state.error ? (
        <Typography color="error">{state.error}</Typography>
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
                {MyUser && recipe.UserId === MyUser.Id && (
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
                )}

              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
};

export default AllRecipes;
