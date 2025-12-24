import type React from "react"
import { useEffect, useState, useContext } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import axios from "axios"
import { userContext } from "../userContext"
import "../Designs/AddRecipe.css"

interface Ingredient {
  Name: string
  Count: string
  Type: string
}

interface RecipeForm {
  Name: string
  Description: string
  prepTime: string
  Difficulty: "קל" | "בינוני" | "קשה" | ""
  Categoryid: number | ""
  Ingridents: Ingredient[]
  Instructions: string
  Img: string
}

interface LocalCategory {
  id: number
  name: string
}

const AddRecipe: React.FC = () => {
  const { MyUser } = useContext(userContext)

  const [categories, setCategories] = useState<LocalCategory[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeForm>({
    defaultValues: {
      Ingridents: [{ Name: "", Count: "", Type: "" }],
      Difficulty: "",
      Categoryid: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Ingridents",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/category")
        const mapped: LocalCategory[] = res.data.map((c: any) => ({
          id: c.Id,
          name: c.Name,
        }))
        setCategories(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: RecipeForm) => {
    console.log("MyUser right now:", MyUser)

    if (!MyUser || !MyUser.Id) {
      alert("משתמש לא מחובר — אי אפשר להוסיף מתכון")
      return
    }

    try {
      if (!MyUser) {
        alert("משתמש לא מחובר")
        return
      }

      const duration = Number.parseInt(data.prepTime, 10)
      if (isNaN(duration)) {
        alert("משך זמן חייב להיות מספר")
        return
      }

      const instructionsArray = data.Instructions.split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => ({ Name: line }))

      const recipe = {
        Name: data.Name,
        Description: data.Description,
        Duration: duration,
        Difficulty: data.Difficulty === "קל" ? 1 : data.Difficulty === "בינוני" ? 2 : data.Difficulty === "קשה" ? 3 : 0,
        Instructions: instructionsArray,
        Img: data.Img,
        UserId: MyUser.Id,
        Categoryid: data.Categoryid || undefined,
        Ingridents: data.Ingridents.map((i) => ({
          Name: i.Name,
          Count: i.Count,
          Type: i.Type,
        })),
      }

      console.log("Recipe body I'm sending:", recipe)

      const res = await axios.post("http://localhost:8080/api/recipe", recipe)

      alert("המתכון נוסף בהצלחה!")
      reset()
    } catch (err: any) {
      console.error(err)
      if (err.response) alert(`שגיאה בהוספת מתכון: ${err.response.data}`)
      else alert("שגיאה בהוספת מתכון")
    }
  }

  if (loading) {
    return (
      <div className="add-recipe-loading">
        <p>טוען קטגוריות...</p>
      </div>
    )
  }

  return (
    <div className="add-recipe-page">
      {/* הדר */}
      <header className="add-recipe-header">
        <div className="add-recipe-header-content">
          <button onClick={() => window.history.back()} className="back-button" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            חזרה
          </button>

          <div className="add-recipe-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
            <span>CookEazy</span>
          </div>
        </div>
      </header>

      <div className="add-recipe-container">
        <div className="add-recipe-content">
          <h1 className="add-recipe-title">הוספת מתכון חדש</h1>
          <p className="add-recipe-subtitle">שתף את המתכון המיוחד שלך עם הקהילה</p>

          <form onSubmit={handleSubmit(onSubmit)} className="add-recipe-form">
            {/* שם מתכון */}
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  {...register("Name", { required: true })}
                  className="form-input"
                  placeholder=" "
                  id="recipe-name"
                />
                <label htmlFor="recipe-name" className="form-label">
                  שם המתכון
                </label>
              </div>
              {errors.Name && <span className="error-message">שדה חובה</span>}
            </div>

            {/* תיאור */}
            <div className="form-group">
              <div className="input-wrapper">
                <textarea
                  {...register("Description")}
                  className="form-textarea"
                  placeholder=" "
                  id="recipe-description"
                  rows={3}
                />
                <label htmlFor="recipe-description" className="form-label">
                  תיאור המתכון
                </label>
              </div>
            </div>

            {/* שורה עם 3 שדות */}
            <div className="form-row">
              {/* זמן הכנה */}
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    {...register("prepTime")}
                    className="form-input"
                    placeholder=" "
                    id="prep-time"
                    type="number"
                  />
                  <label htmlFor="prep-time" className="form-label">
                    זמן הכנה (דקות)
                  </label>
                </div>
              </div>

              {/* רמת קושי */}
              <div className="form-group">
                <div className="input-wrapper">
                  <select {...register("Difficulty")} className="form-select" id="difficulty">
                    <option value="">בחר רמה</option>
                    <option value="קל">קל</option>
                    <option value="בינוני">בינוני</option>
                    <option value="קשה">קשה</option>
                  </select>
                  <label htmlFor="difficulty" className="form-label select-label">
                    רמת קושי
                  </label>
                </div>
              </div>

              {/* קטגוריה */}
              <div className="form-group">
                <div className="input-wrapper">
                  <select {...register("Categoryid", { required: true })} className="form-select" id="category">
                    <option value="">בחר קטגוריה</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="category" className="form-label select-label">
                    קטגוריה
                  </label>
                </div>
                {errors.Categoryid && <span className="error-message">שדה חובה</span>}
              </div>
            </div>

            {/* מרכיבים */}
            <div className="form-group">
              <h3 className="section-title">מרכיבים</h3>

              {fields.map((field, index) => (
                <div key={field.id} className="ingredient-row">
                  <div className="input-wrapper ingredient-input">
                    <input
                      {...register(`Ingridents.${index}.Name` as const, {
                        required: true,
                      })}
                      placeholder=" "
                      className="form-input"
                      id={`ingredient-name-${index}`}
                    />
                    <label htmlFor={`ingredient-name-${index}`} className="form-label">
                      שם המרכיב
                    </label>
                  </div>

                  <div className="input-wrapper ingredient-input">
                    <input
                      {...register(`Ingridents.${index}.Count` as const, {
                        required: true,
                      })}
                      placeholder=" "
                      className="form-input"
                      id={`ingredient-count-${index}`}
                    />
                    <label htmlFor={`ingredient-count-${index}`} className="form-label">
                      כמות
                    </label>
                  </div>

                  <div className="input-wrapper ingredient-input">
                    <input
                      {...register(`Ingridents.${index}.Type` as const)}
                      placeholder=" "
                      className="form-input"
                      id={`ingredient-type-${index}`}
                    />
                    <label htmlFor={`ingredient-type-${index}`} className="form-label">
                      יחידה
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="remove-btn"
                    disabled={fields.length === 1}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ Name: "", Count: "", Type: "" })}
                className="add-ingredient-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                הוסף מרכיב
              </button>
            </div>

            {/* הוראות */}
            <div className="form-group">
              <div className="input-wrapper">
                <textarea
                  {...register("Instructions")}
                  rows={6}
                  className="form-textarea"
                  placeholder=" "
                  id="instructions"
                />
                <label htmlFor="instructions" className="form-label">
                  הוראות הכנה
                </label>
              </div>
              <small className="input-hint">כל שורה תהיה שלב נפרד</small>
            </div>

            {/* תמונה */}
            <div className="form-group">
              <div className="input-wrapper">
                <input {...register("Img")} className="form-input" placeholder=" " id="image-url" />
                <label htmlFor="image-url" className="form-label">
                  כתובת תמונה (URL)
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              שמור מתכון
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddRecipe
