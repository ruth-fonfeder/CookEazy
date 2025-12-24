"use client"

import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../Designs/SignIn.css"
import type { user } from "../types"
import { userContext } from "../userContext"


const schema = yup.object().shape({
  username: yup.string().required("שם משתמש הוא שדה חובה").min(4, "שם משתמש חייב להיות לפחות 4 תווים"),
  password: yup.string().required("סיסמה היא שדה חובה").min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
  name: yup.string().required("שם הוא שדה חובה"),
  phone: yup.string().required("טלפון הוא שדה חובה"),
  email: yup.string().required("אימייל הוא שדה חובה").email("אימייל לא חוקי"),
  tz: yup.string().required("תעודת זהות היא שדה חובה").min(9, "תעודת זהות חייבת להכיל לפחות 9 תווים"),
})

const SignIn = () => {
  const { setMyUser } = useContext(userContext)
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: any) => {
    console.log(data)

    try {
      const response = await axios.post<user>("http://localhost:8080/api/user/sighin", {
        UserName: data.username,
        Password: data.password,
        Name: data.name,
        Phone: data.phone,
        Email: data.email,
        Tz: data.tz,
      })
      console.log("✅ המשתמש נרשם בהצלחה:", response.data)
      setMyUser({
        Id: response.data.Id,
        password: response.data.password,
        name: response.data.name,
        username: response.data.username,
        phone: response.data.phone,
        email: response.data.email,
        tz: response.data.tz,
      })
      navigate("/Home")
    } catch (error: any) {
      if (error.response) {
        console.error("❌ שגיאת שרת:", error.response.status, error.response.data)
      } else if (error.request) {
        console.error("⚠️ שגיאת רשת: אין תגובה מהשרת")
      } else {
        console.error("🔴 שגיאה לא צפויה:", error.message)
      }
    }
  }

  return (
    <div className="signin-container">
      {/* צד שמאל - תמונה */}
      <div className="signin-image-side">
        <div className="signin-overlay">
          <div className="signin-logo">
            <svg className="chef-hat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
            <h1>CookEazy</h1>
          </div>
          <p className="signin-tagline">בשל בקלות, תהנה מכל רגע</p>
        </div>
      </div>

      {/* צד ימין - טופס */}
      <div className="signin-form-side">
        <div className="signin-form-wrapper">
          <div className="signin-header">
            <h2>הצטרף ל-CookEazy</h2>
            <p>צור חשבון חדש והתחל לבשל</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
            {/* שורה ראשונה - שם משתמש וסיסמה */}
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <input id="username" type="text" placeholder=" " {...register("username")} />
                  <label htmlFor="username">שם משתמש</label>
                </div>
                {errors.username && <p className="error-message">{errors.username.message}</p>}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input id="password" type="password" placeholder=" " {...register("password")} />
                  <label htmlFor="password">סיסמה</label>
                </div>
                {errors.password && <p className="error-message">{errors.password.message}</p>}
              </div>
            </div>

            {/* שורה שנייה - שם ומספר טלפון */}
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <input id="name" type="text" placeholder=" " {...register("name")} />
                  <label htmlFor="name">שם מלא</label>
                </div>
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input id="phone" type="text" placeholder=" " {...register("phone")} />
                  <label htmlFor="phone">טלפון</label>
                </div>
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
              </div>
            </div>

            {/* שורה שלישית - אימייל ות.ז */}
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <input id="email" type="email" placeholder=" " {...register("email")} />
                  <label htmlFor="email">אימייל</label>
                </div>
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input id="tz" type="text" placeholder=" " {...register("tz")} />
                  <label htmlFor="tz">תעודת זהות</label>
                </div>
                {errors.tz && <p className="error-message">{errors.tz.message}</p>}
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "נרשם..." : "הרשמה"}
            </button>

            <p className="signin-footer">
              כבר יש לך חשבון? <a href="/login">התחבר כאן</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
