import React, { useReducer, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../userContext";
import "../Designs/AllRecipes.css"; // ודאי שהנתיב נכון

const initialState = { recipes: [], loading: true, error: null };

const recipeReducer = (state: any, action: any): any => {
  switch (action.type) {
    case "SET_RECIPES": return { ...state, recipes: action.payload, loading: false };
    case "SET_LOADING": return { ...state, loading: true };
    case "SET_ERROR": return { ...state, error: action.payload, loading: false };
    default: return state;
  }
};

const AllRecipes = () => {
  const { MyUser, setMyUser } = useContext(userContext);
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const navigate = useNavigate();
  const [isFiltered, setIsFiltered] = useState(false);
  
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // --- Functions (Your Original Logic) ---
  const fetchRecipes = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await axios.get("http://localhost:8080/api/recipe");
      dispatch({ type: "SET_RECIPES", payload: response.data });
    } catch (error) { dispatch({ type: "SET_ERROR", payload: "שגיאה בטעינה" }); }
  };

  useEffect(() => {
    fetchRecipes();
    const fetchCats = async () => {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    };
    fetchCats();
  }, []);

  const handleFilterButton = async () => {
    if (!isFiltered) {
      dispatch({ type: "SET_LOADING" });
      const diffVal = difficulty === "קל" ? 1 : difficulty === "בינוני" ? 2 : difficulty === "קשה" ? 3 : undefined;
      const response = await axios.get("http://localhost:8080/api/recipe", {
        params: { CategoryId: category || undefined, Duration: duration || undefined, Difficulty: diffVal }
      });
      dispatch({ type: "SET_RECIPES", payload: response.data });
      setIsFiltered(true);
    } else {
      setCategory(""); setDuration(""); setDifficulty("");
      setIsFiltered(false);
      fetchRecipes();
    }
  };

  const handleDelete = async (e: any, id: number) => {
    e.stopPropagation();
    if (!window.confirm("למחוק מתכון?")) return;
    try {
      await axios.post(`http://localhost:8080/api/recipe/delete/${id}`);
      dispatch({ type: "SET_RECIPES", payload: state.recipes.filter((r: any) => r.Id !== id) });
    } catch (err) { alert("שגיאה במחיקה"); }
  };

  return (
    <div className="all-recipes-container">
      {/* Header */}
      <header className="recipes-header">
        <div className="header-left" onClick={() => navigate("/")}>
          <svg className="header-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
          </svg>
          <span className="brand-name">CookEazy</span>
        </div>

        <div className="header-right">
          <button className="nav-link" onClick={() => navigate("/Home")}>בית</button>
          {MyUser && (
            <>
              <button className="add-recipe-btn" onClick={() => navigate("/AddRecipe")}>➕ הוספת מתכון</button>
              <button className="nav-link" onClick={() => { setMyUser(null); navigate("/"); }}>התנתקות</button>
            </>
          )}
        </div>
      </header>

      {/* Filter Section */}
      <div className="filter-section">
        <select className="filter-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">כל הקטגוריות</option>
          {categories.map((c: any) => <option key={c.Id} value={c.Id}>{c.Name}</option>)}
        </select>

        <input className="filter-input" type="number" placeholder="זמן (דק')" value={duration} onChange={(e) => setDuration(e.target.value)} />

        <select className="filter-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">רמת קושי</option>
          <option value="קל">🍀 קל</option>
          <option value="בינוני">⚡ בינוני</option>
          <option value="קשה">🔥 קשה</option>
        </select>

        <button className="filter-btn" onClick={handleFilterButton}>
          {isFiltered ? "איפוס" : "חפש מתכון"}
        </button>
      </div>

      {/* Grid */}
      <main className="recipes-grid">
        {state.loading ? <p>טוען מתכונים...</p> : 
          state.recipes.map((recipe: any) => (
            <div className="recipe-card" key={recipe.Id} onClick={() => navigate(`/RecipeDetails/${recipe.Id}`)}>
              <img className="recipe-img" src={recipe.Img || "https://via.placeholder.com/300"} alt={recipe.Name} />
              <div className="recipe-body">
                <div className="difficulty-badge">
                   {recipe.Difficulty === 1 || recipe.Difficulty === "קל" ? "🍀 קל" : 
                    recipe.Difficulty === 2 || recipe.Difficulty === "בינוני" ? "⚡ בינוני" : "🔥 קשה"}
                </div>
                <h3 className="recipe-title">{recipe.Name}</h3>
                <p className="recipe-desc">{recipe.Description}</p>
                
                <div className="recipe-footer">
                  <span>⏳ {recipe.Duration} דק'</span>
                  {MyUser && recipe.UserId === MyUser.Id && (
                    <div className="admin-actions">
                      <button className="edit-btn" onClick={(e) => { e.stopPropagation(); navigate(`/UpdateRecipe/${recipe.Id}`); }}>ערוך</button>
                      <button className="delete-btn" onClick={(e) => handleDelete(e, recipe.Id)}>מחק</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </main>
    </div>
  );
};

export default AllRecipes;