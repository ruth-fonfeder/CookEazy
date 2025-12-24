
import React, { useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../userContext";
import "../Designs/AllRecipes.css"; 


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

const MyRecipe = () => {
    const { MyUser } = useContext(userContext);
    const [state, dispatch] = useReducer(recipeReducer, initialState);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRecipes = async () => {
            dispatch({ type: "SET_LOADING" });
            try {
                const response = await axios.get("http://localhost:8080/api/recipe");
                // סינון לפי המשתמש המחובר
                const myRecipes = response.data.filter(
                    (r: any) => r.UserId === MyUser?.Id
                );
                dispatch({ type: "SET_RECIPES", payload: myRecipes });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "נכשל בטעינת מתכונים" });
            }
        };
        if (MyUser) fetchMyRecipes();
    }, [MyUser]);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); 
        if (!window.confirm("בטוח שאת רוצה למחוק את המתכון?")) return;

        try {
            await axios.post(`http://localhost:8080/api/recipe/delete/${id}`);
            dispatch({
                type: "SET_RECIPES",
                payload: state.recipes.filter((r: any) => r.Id !== id),
            });
            alert("המתכון נמחק בהצלחה!");
        } catch (err) {
            console.error(err);
            alert("שגיאה במחיקה");
        }
    };

    const handleUpdate = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        navigate(`/UpdateRecipe/${id}`);
    };

    if (!MyUser) {
        return (
            <div className="all-recipes-container">
                <div style={{ textAlign: "center", padding: "5rem" }}>
                    <h2>אנא התחברי כדי לראות את המתכונים שלך</h2>
                    <button className="add-recipe-btn" onClick={() => navigate("/login")}>להתחברות</button>
                </div>
            </div>
        );
    }

    return (
        <div className="all-recipes-container">
            {/* Header - מותאם לעיצוב שלך */}
            <header className="recipes-header">
                <div className="header-left" onClick={() => navigate("/AllRecipes")}>
                    <svg className="header-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                    </svg>
                    <span className="brand-name">CookEazy - המתכונים שלי</span>
                </div>
                <div className="header-right">
                    <button className="nav-link" onClick={() => navigate("/AllRecipes")}>כל המתכונים</button>
                    <button className="add-recipe-btn" onClick={() => navigate("/AddRecipe")}>+ הוסף מתכון</button>
                </div>
            </header>

            <div style={{ textAlign: "center", padding: "2rem" }}>
                <h1 style={{ color: "#2d3436", fontSize: "2.5rem" }}>המתכונים שלי</h1>
                <p style={{ color: "#666" }}>כל היצירות הקולינריות שפרסמת</p>
            </div>

            {state.loading ? (
                <div style={{ textAlign: "center" }}>טוען...</div>
            ) : state.recipes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                    <p>עדיין לא פרסמת מתכונים.</p>
                    <button className="filter-btn" onClick={() => navigate("/AddRecipe")}>פרסמי את המתכון הראשון שלך!</button>
                </div>
            ) : (
                <div className="recipes-grid">
                    {state.recipes.map((recipe: any) => (
                        <div className="recipe-card" key={recipe.Id} onClick={() => navigate(`/RecipeDetails/${recipe.Id}`)}>
                            <img src={recipe.Img} alt={recipe.Name} className="recipe-img" />
                            
                            <div className="recipe-body">
                                <div className="difficulty-badge">
                                    {recipe.Difficulty === 1 ? "קל" : recipe.Difficulty === 2 ? "בינוני" : "קשה"}
                                </div>
                                <h3 className="recipe-title">{recipe.Name}</h3>
                                <p className="recipe-desc">{recipe.Description}</p>
                                
                                <div className="recipe-footer">
                                    <span style={{ fontSize: "0.85rem", color: "#629584", fontWeight: "bold" }}>
                                        ⏱ {recipe.Duration} דק'
                                    </span>
                                    
                                    <div className="admin-actions">
                                        <button 
                                            className="edit-btn" 
                                            onClick={(e) => handleUpdate(e, recipe.Id)}
                                        >
                                            עריכה
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={(e) => handleDelete(e, recipe.Id)}
                                        >
                                            מחיקה
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipe;