import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import styles from "../Designs/AddRecipe.module.css";
import { userContext } from "../userContext";

interface Ingredient {
  Name: string;
  Count: string;
  Type: string;
}

interface RecipeForm {
  Name: string;
  Description: string;
  prepTime: string;
  Difficulty: "קל" | "בינוני" | "קשה" | "";
  Categoryid: number | "";
  Ingridents: Ingredient[];
  Instructions: string;
  Img: string;
}

const UpdateRecipe: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { MyUser } = useContext(userContext);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

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
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Ingridents",
  });

  // -------- 1. טוען קטגוריות --------
  useEffect(() => {
    axios.get("http://localhost:8080/api/category")
      .then(res => {
        const mapped = res.data.map((c: any) => ({
          id: c.Id,
          name: c.Name,
        }));
        setCategories(mapped);
      });
  }, []);

  // -------- 2. טוען מתכון --------
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        const r = res.data;

        // הכנה למבנה של ה-form
        reset({
          Name: r.Name,
          Description: r.Description,
          prepTime: r.Duration.toString(),
          Difficulty:
            r.Difficulty === 1 ? "קל" :
            r.Difficulty === 2 ? "בינוני" :
            r.Difficulty === 3 ? "קשה" : "",
          Categoryid: r.Categoryid,
          Img: r.Img,
          Instructions: r.Instructions?.map((i:any)=>i.Name).join("\n") || "",
          Ingridents: r.Ingridents?.length
            ? r.Ingridents.map((i:any)=>({
                Name: i.Name,
                Count: i.Count,
                Type: i.Type
              }))
            : [{ Name: "", Count: "", Type: "" }],
            
        },
        { keepDefaultValues: true } // ← ✅ פרמטר שני
    );
      


        setLoading(false);

      } catch (err) {
        console.error(err);
        alert("שגיאה בטעינת מתכון");
      }
    };

    loadRecipe();
  }, [id, reset]);

  // -------- 3. שומר --------
  const onSubmit = async (data: RecipeForm) => {
    try {
      const instructionsArray = data.Instructions
        .split("\n")
        .filter(t => t.trim() !== "")
        .map(t => ({ Name: t }));

      const body = {
        Id: id,
        Name: data.Name,
        Description: data.Description,
        Img: data.Img,
        UserId: MyUser?.Id,
        Duration: parseInt(data.prepTime),
        Categoryid: data.Categoryid,
        Difficulty:
          data.Difficulty === "קל" ? 1 :
          data.Difficulty === "בינוני" ? 2 :
          data.Difficulty === "קשה" ? 3 : 0,
        Instructions: instructionsArray,
        Ingridents: data.Ingridents.map(i => ({
          Name: i.Name,
          Count: i.Count,
          Type: i.Type,
        })),
      };

      await axios.post("http://localhost:8080/api/recipe/edit", body);

      alert("המתכון עודכן בהצלחה!");
      navigate("/MyRecipe");

    } catch (err: any) {
      console.error(err);
      alert("שגיאה בעדכון מתכון");
    }
  };

  if (loading) return <p>טוען...</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>✏️ עריכת מתכון</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* שם מתכון */}
        <div className={styles.formGroup}>
          <label>שם המתכון</label>
          <input {...register("Name", { required: true })} className={styles.input} />
        </div>

        {/* תיאור */}
        <div className={styles.formGroup}>
          <label>תיאור</label>
          <textarea {...register("Description")} className={styles.textarea} />
        </div>

        {/* זמן הכנה */}
        <div className={styles.formGroup}>
          <label>⏱ זמן הכנה</label>
          <input {...register("prepTime")} className={styles.input} />
        </div>

        {/* רמה */}
        <div className={styles.formGroup}>
          <label>רמת קושי</label>
          <select {...register("Difficulty")} className={styles.select}>
            <option value="">בחר רמה</option>
            <option value="קל">קל</option>
            <option value="בינוני">בינוני</option>
            <option value="קשה">קשה</option>
          </select>
        </div>

        {/* קטגוריה */}
        <div className={styles.formGroup}>
          <label>🍽 קטגוריה</label>
          <select {...register("Categoryid")} className={styles.select}>
            <option value="">בחר קטגוריה</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* מרכיבים */}
        <div className={styles.formGroup}>
          <label>🥕 מרכיבים</label>

          {fields.map((field, index) => (
            <div key={field.id} className={styles.ingredientRow}>
              <input
                {...register(`Ingridents.${index}.Name` as const)}
                placeholder="שם"
                className={styles.input}
              />

              <input
                {...register(`Ingridents.${index}.Count` as const)}
                placeholder="כמות"
                className={styles.input}
              />

              <input
                {...register(`Ingridents.${index}.Type` as const)}
                placeholder="יחידה"
                className={styles.input}
              />

              <span onClick={() => remove(index)} className={styles.removeButton}>
                הסר
              </span>
            </div>
          ))}

          <span
            onClick={() => append({ Name: "", Count: "", Type: "" })}
            className={styles.addIngredient}
          >
            ➕ הוסף מרכיב
          </span>
        </div>

        {/* הוראות */}
        <div className={styles.formGroup}>
          <label>📜 הוראות הכנה</label>
          <textarea {...register("Instructions")} className={styles.textarea} />
        </div>

        {/* תמונה */}
        <div className={styles.formGroup}>
          <label>🖼 כתובת תמונה (URL)</label>
          <input {...register("Img")} className={styles.input} />
        </div>

        <button type="submit" className={styles.button}>
          עדכן מתכון
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipe;

