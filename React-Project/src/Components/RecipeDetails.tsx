import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { userContext } from "../userContext";
import "../Designs/RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { MyUser, setMyUser } = useContext(userContext);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/recipe");
   
        console.log("Recipes from server:", response.data);
        console.log("ID from URL:", id);

        const found = response.data.find((r: any) => r.Id == id);
        
        if (found) {
            setRecipe(found);
        } else {
            console.error("Recipe not found in the list");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeData();
    }
  }, [id]);

  if (loading) return <div className="recipe-details-page"><p style={{textAlign: "center", paddingTop: "50px"}}>טוען את המתכון...</p></div>;
  if (!recipe) return <div className="recipe-details-page"><p style={{textAlign: "center", paddingTop: "50px"}}>המתכון לא נמצא :(</p></div>;

  return (
    <div className="recipe-details-page">
      {/* Header זהה לשאר האתר */}
      <header className="details-header">
        <div className="header-left" style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#629584', cursor: 'pointer'}} onClick={() => navigate("/")}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
          </svg>
          <span style={{fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'serif'}}>CookEazy</span>
        </div>
        <div className="header-right" style={{display: 'flex', gap: '20px'}}>
           <button style={{background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate("/Home")}>בית</button>
           {MyUser && <button style={{background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => {setMyUser(null); navigate("/")}}>התנתקות</button>}
        </div>
      </header>

      <Link to="/AllRecipes" className="back-link">
        <span>→</span> חזרה לכל המתכונים
      </Link>

      <main className="recipe-container">
        {/* Hero Section */}
        <section className="recipe-hero-section">
          <div className="details-img-container">
            <img src={recipe.Img || "https://via.placeholder.com/500"} alt={recipe.Name} className="details-img" />
          </div>
          
          <div className="details-info">
            <div className="details-difficulty">
              {recipe.Difficulty === 1 || recipe.Difficulty === "קל" ? "🍀 קל" : 
               recipe.Difficulty === 2 || recipe.Difficulty === "בינוני" ? "⚡ בינוני" : "🔥 קשה"}
            </div>
            <h1 className="details-title">{recipe.Name}</h1>
            <p className="details-desc">{recipe.Description}</p>
            
            <div className="meta-info-grid">
              <div className="meta-item">
                <span>⏳</span> {recipe.Duration} דקות
              </div>
              <div className="meta-item">
                <span>👤</span> מאת: {recipe.UserId === MyUser?.Id ? "אותך" : "בשלן בקהילה"}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="recipe-grid-content">
          {/* מצרכים */}
          <aside className="ingredients-card">
            <h2 className="section-h2">מצרכים</h2>
            <ul className="ing-list">
              {recipe.Ingridents && recipe.Ingridents.map((ing: any, index: number) => (
                <li key={index} className="ing-item">
                  <span className="ing-bullet"></span>
                  {ing.Count} {ing.Type} {ing.Name}
                </li>
              ))}
            </ul>
          </aside>

          {/* הוראות הכנה */}
          <section className="instructions-card">
            <h2 className="section-h2">אופן ההכנה</h2>
            <div className="ins-list">
              {recipe.Instructions && recipe.Instructions.map((inst: any, index: number) => (
                <div key={index} className="ins-item">
                  <div className="ins-num">{index + 1}</div>
                  <p className="ins-text">{inst.Name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetails;