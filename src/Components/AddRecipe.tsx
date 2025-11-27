import React, { useEffect, useState, useContext } from "react";
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

interface LocalCategory {
  id: number;
  name: string;
}

const AddRecipe: React.FC = () => {
  const { MyUser } = useContext(userContext);

  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 👉 טוען קטגוריות
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/category");
        const mapped: LocalCategory[] = res.data.map((c: any) => ({
          id: c.Id,
          name: c.Name,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

 


  const onSubmit = async (data: RecipeForm) => {
    console.log("MyUser right now:", MyUser);

    if (!MyUser || !MyUser.Id) {
      alert("משתמש לא מחובר — אי אפשר להוסיף מתכון");
      return;
    }
    
    try {
      if (!MyUser) {
        alert("משתמש לא מחובר");
        return;
      }
  
      const duration = parseInt(data.prepTime, 10);
      if (isNaN(duration)) {
        alert("משך זמן חייב להיות מספר");
        return;
      }
  
      // ממירים הוראות לאובייקטים מתאימים ל-Sequelize
      const instructionsArray = data.Instructions
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => ({ Name: line }));
  
      const recipe = {
        Name: data.Name,
        Description: data.Description,
        Duration: duration,
        Difficulty:
          data.Difficulty === "קל" ? 1 :
          data.Difficulty === "בינוני" ? 2 :
          data.Difficulty === "קשה" ? 3 : 0,
        Instructions: instructionsArray,  // <<<<<< זה הכי חשוב!!
  
        Img: data.Img,
        UserId: MyUser.Id,
  
        Categoryid: data.Categoryid || undefined,
  
        Ingridents: data.Ingridents.map(i => ({
          Name: i.Name,
          Count: i.Count,
          Type: i.Type,
        })),
      };
      console.log("Current user from context:", MyUser);
console.log("UserId:", MyUser?.Id);

  
      console.log("Recipe body I'm sending:", recipe);
  
      const res = await axios.post("http://localhost:8080/api/recipe", recipe);
  
      alert("המתכון נוסף בהצלחה!");
      reset();
  
    } catch (err: any) {
      console.error(err);
      if (err.response)
        alert(`שגיאה בהוספת מתכון: ${err.response.data}`);
      else
        alert("שגיאה בהוספת מתכון");
    }
  };
  

  if (loading) return <p>טוען קטגוריות...</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>➕ הוספת מתכון חדש</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* שם מתכון */}
        <div className={styles.formGroup}>
          <label>שם המתכון</label>
          <input {...register("Name", { required: true })} className={styles.input} />
          {errors.Name && <span style={{ color: "red" }}>שדה חובה</span>}
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

        {/* רמת קושי */}
        <div className={styles.formGroup}>
          <label>🎯 רמת קושי</label>
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
          <select
            {...register("Categoryid", { required: true })}
            className={styles.select}
          >
            <option value="">בחר קטגוריה</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.Categoryid && (
            <span style={{ color: "red" }}>שדה חובה</span>
          )}
        </div>

        {/* מרכיבים */}
        <div className={styles.formGroup}>
          <label>🥕 מרכיבים</label>

          {fields.map((field, index) => (
            <div key={field.id} className={styles.ingredientRow}>
              <input
                {...register(`Ingridents.${index}.Name` as const, {
                  required: true,
                })}
                placeholder="שם"
                className={styles.input}
              />

              <input
                {...register(`Ingridents.${index}.Count` as const, {
                  required: true,
                })}
                placeholder="כמות"
                className={styles.input}
              />

              <input
                {...register(`Ingridents.${index}.Type` as const)}
                placeholder="יחידה"
                className={styles.input}
              />

              <span
                onClick={() => remove(index)}
                className={styles.removeButton}
              >
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
          <textarea
            {...register("Instructions")}
            rows={4}
            className={styles.textarea}
          />
        </div>

        {/* תמונה */}
        <div className={styles.formGroup}>
          <label>🖼 כתובת תמונה (URL)</label>
          <input {...register("Img")} className={styles.input} />
        </div>

        <button type="submit" className={styles.button}>
          שמור מתכון
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
