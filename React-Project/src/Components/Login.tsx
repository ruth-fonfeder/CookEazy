import type React from "react"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { userContext } from "../userContext"
import "../Designs/Login.css"

const Login = () => {
  const [UserName, setUserName] = useState("")
  const [Password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const { setMyUser } = useContext(userContext)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName, Password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data || "שם משתמש או סיסמה שגויים")
        return
      }

      const userData = data.dataValues || data
      setMyUser(userData)
      sessionStorage.setItem("user", JSON.stringify(userData))

      console.log("Logged in user:", data)
      setError("")

      navigate("/Home")
    } catch (err: any) {
      console.error("Error logging in:", err.message)
      setError("שם משתמש או סיסמה שגוי, נסי שנית")
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
          </div>
          <h1 className="login-brand">CookEazy</h1>
          <p className="login-tagline">התחבר והתחל לבשל</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <h2 className="login-title">התחברות</h2>
          <p className="login-subtitle">ברוכים השבים למטבח שלכם</p>

          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="login-form">
            <div className="login-input-group">
              <input
                type="text"
                id="username"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
                className="login-input"
                placeholder=" "
                required
              />
              <label htmlFor="username" className="login-label">
                שם משתמש
              </label>
            </div>

            <div className="login-input-group">
              <input
                type="password"
                id="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder=" "
                required
              />
              <label htmlFor="password" className="login-label">
                סיסמה
              </label>
            </div>

            <button type="submit" className="login-button">
              התחבר
            </button>

            <p className="login-footer">
              עדיין לא רשומים? <a href="/signin">הירשמו כאן</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
