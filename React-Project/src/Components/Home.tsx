import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { userContext } from "../userContext"
import { ChefHat, BookOpen, Plus, LogOut, List, User } from "lucide-react"
import "../Designs/Home.css"

const Home = () => {
  const { MyUser } = useContext(userContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    // כאן תוסיפי את לוגיקת ההתנתקות שלך
    navigate("/login")
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="header-logo">
            <ChefHat className="logo-icon" />
            <span className="logo-text">CookEazy</span>
          </div>

          <nav className="header-nav">
            {MyUser && (
              <div className="user-welcome">
                <User className="user-icon" />
                <span>שלום, {MyUser.name}</span>
              </div>
            )}
            <button onClick={handleLogout} className="logout-btn">
              <LogOut className="logout-icon" />
              <span>התנתק</span>
            </button>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to CookEazy</h1>
          <p className="hero-subtitle">בשל בקלות, תהנה מכל רגע</p>
        </div>
      </section>

      <section className="navigation-section">
        <div className="nav-cards-container">
          <div className="nav-cards-row">
            <Link to="/AllRecipes" className="nav-card">
              <div className="nav-card-icon">
                <List />
              </div>
              <h3 className="nav-card-title">בחר לפי קטגוריה</h3>
              <p className="nav-card-description">סינון מתכונים לפי סוג האוכל</p>
            </Link>

            <Link to="/MyRecipe" className="nav-card">
              <div className="nav-card-icon">
                <User />
              </div>
              <h3 className="nav-card-title">המתכונים שלי</h3>
              <p className="nav-card-description">צפה וערוך את המתכונים האישיים שלך</p>
            </Link>

            <Link to="/AllRecipes" className="nav-card">
              <div className="nav-card-icon">
                <BookOpen />
              </div>
              <h3 className="nav-card-title">כל המתכונים</h3>
              <p className="nav-card-description">גלה מתכונים מדהימים מהקהילה</p>
            </Link>
          </div>

          <div className="nav-cards-row centered">
            <Link to="/AddRecipe" className="nav-card add-recipe-featured">
              <div className="nav-card-icon">
                <Plus />
              </div>
              <h3 className="nav-card-title">הוסף מתכון</h3>
              <p className="nav-card-description">שתף את המתכון האהוב עליך</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
