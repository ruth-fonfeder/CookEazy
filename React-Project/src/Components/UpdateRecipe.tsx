import type React from "react"
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
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

const UpdateRecipe: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { MyUser } = useContext(userContext)

  const [categories, setCategories] = useState<any[]>([])
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

  // 1. טעינת קטגוריות ונתוני המתכון
  useEffect(() => {
    const fetchData = async () => {
      try {
        // טעינת קטגוריות
        const catRes = await axios.get("http://localhost:8080/api/category")
        setCategories(catRes.data.map((c: any) => ({ id: c.Id, name: c.Name })))

        // טעינת נתוני המתכון הספציפי
        const recipeRes = await axios.get(`http://localhost:8080/api/recipe/${id}`)
        const r = recipeRes.data

        reset({
          Name: r.Name,
          Description: r.Description,
          prepTime: r.Duration.toString(),
          Difficulty:
            r.Difficulty === 1 ? "קל" : r.Difficulty === 2 ? "בינוני" : r.Difficulty === 3 ? "קשה" : "",
          Categoryid: r.Categoryid,
          Img: r.Img,
          Instructions: r.Instructions?.map((i: any) => i.Name).join("\n") || "",
          Ingridents: r.Ingridents?.length
            ? r.Ingridents.map((i: any) => ({
                Name: i.Name,
                Count: i.Count,
                Type: i.Type,
              }))
            : [{ Name: "", Count: "", Type: "" }],
        })
      } catch (err) {
        console.error(err)
        alert("שגיאה בטעינת הנתונים")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, reset])

 
  const onSubmit = async (data: RecipeForm) => {
    try {
      const instructionsArray = data.Instructions.split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => ({ Name: line }))

      const body = {
        Id: id,
        Name: data.Name,
        Description: data.Description,
        Img: data.Img,
        UserId: MyUser?.Id,
        Duration: Number.parseInt(data.prepTime, 10),
        Categoryid: data.Categoryid,
        Difficulty: data.Difficulty === "קל" ? 1 : data.Difficulty === "בינוני" ? 2 : data.Difficulty === "קשה" ? 3 : 0,
        Instructions: instructionsArray,
        Ingridents: data.Ingridents.map((i) => ({
          Name: i.Name,
          Count: i.Count,
          Type: i.Type,
        })),
      }

      await axios.post("http://localhost:8080/api/recipe/edit", body)
      alert("המתכון עודכן בהצלחה!")
      navigate("/AllRecipes") 
    } catch (err) {
      console.error(err)
      alert("שגיאה בעדכון המתכון")
    }
  }

  if (loading) return <div className="add-recipe-loading">טוען מתכון לעריכה...</div>

  return (
    <div className="add-recipe-page">
      <header className="add-recipe-header">
        <div className="add-recipe-header-content">
          <button onClick={() => navigate(-1)} className="back-button" type="button">
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
          <h1 className="add-recipe-title">עריכת מתכון</h1>
          <p className="add-recipe-subtitle">עדכן את פרטי המתכון שלך</p>

          <form onSubmit={handleSubmit(onSubmit)} className="add-recipe-form">
         
            <div className="form-group">
              <div className="input-wrapper">
                <input {...register("Name", { required: true })} className="form-input" placeholder=" " id="name" />
                <label htmlFor="name" className="form-label">שם המתכון</label>
              </div>
              {errors.Name && <span className="error-message">שדה חובה</span>}
            </div>

          
            <div className="form-group">
              <div className="input-wrapper">
                <textarea {...register("Description")} className="form-textarea" placeholder=" " id="desc" rows={3} />
                <label htmlFor="desc" className="form-label">תיאור המתכון</label>
              </div>
            </div>

     
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <input {...register("prepTime")} className="form-input" type="number" placeholder=" " id="time" />
                  <label htmlFor="time" className="form-label">זמן הכנה (דקות)</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <select {...register("Difficulty")} className="form-select" id="diff">
                    <option value="">בחר רמה</option>
                    <option value="קל">קל</option>
                    <option value="בינוני">בינוני</option>
                    <option value="קשה">קשה</option>
                  </select>
                  <label htmlFor="diff" className="form-label select-label">רמת קושי</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <select {...register("Categoryid", { required: true })} className="form-select" id="cat">
                    <option value="">בחר קטגוריה</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <label htmlFor="cat" className="form-label select-label">קטגוריה</label>
                </div>
              </div>
            </div>

            {/* מרכיבים */}
            <div className="form-group">
              <h3 className="section-title">מרכיבים</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="ingredient-row">
                  <div className="input-wrapper ingredient-input">
                    <input {...register(`Ingridents.${index}.Name` as const)} className="form-input" placeholder=" " />
                    <label className="form-label">שם המרכיב</label>
                  </div>
                  <div className="input-wrapper ingredient-input">
                    <input {...register(`Ingridents.${index}.Count` as const)} className="form-input" placeholder=" " />
                    <label className="form-label">כמות</label>
                  </div>
                  <div className="input-wrapper ingredient-input">
                    <input {...register(`Ingridents.${index}.Type` as const)} className="form-input" placeholder=" " />
                    <label className="form-label">יחידה</label>
                  </div>
                  <button type="button" onClick={() => remove(index)} className="remove-btn" disabled={fields.length === 1}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ Name: "", Count: "", Type: "" })} className="add-ingredient-btn">
                + הוסף מרכיב
              </button>
            </div>

           
            <div className="form-group">
              <div className="input-wrapper">
                <textarea {...register("Instructions")} className="form-textarea" placeholder=" " id="ins" rows={6} />
                <label htmlFor="ins" className="form-label">הוראות הכנה</label>
              </div>
              <small className="input-hint">כל שורה היא שלב</small>
            </div>

           
            <div className="form-group">
              <div className="input-wrapper">
                <input {...register("Img")} className="form-input" placeholder=" " id="img" />
                <label htmlFor="img" className="form-label">כתובת תמונה (URL)</label>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
              </svg>
              עדכן מתכון
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateRecipe