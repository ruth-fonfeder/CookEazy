// import React, { useState } from "react";
// const AddRecipeForm = () => {
//   const [recipe, setRecipe] = useState({
//     name: "",
//     description: "",
//     ingredients: [{ name: "", quantity: "", unit: "" }],
//     instructions: [{ step: "" }],
//     duration: "",
//     difficulty: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//     setRecipe({
//       ...recipe,
//       [field]: e.target.value,
//     });
//   };

//   const handleIngredientChange = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const newIngredients = [...recipe.ingredients];
//     newIngredients[index] = { ...newIngredients[index], [e.target.name]: e.target.value };
//     setRecipe({
//       ...recipe,
//       ingredients: newIngredients,
//     });
//   };

//   const handleAddIngredient = () => {
//     setRecipe({
//       ...recipe,
//       ingredients: [...recipe.ingredients, { name: "", quantity: "", unit: "" }],
//     });
//   };

//   const handleAddInstruction = () => {
//     setRecipe({
//       ...recipe,
//       instructions: [...recipe.instructions, { step: "" }],
//     });
//   };

//   const handleSave = () => {
//     console.log("Recipe saved", recipe);
//   };

//   return (
//     <div className="form-container">
//       <form onSubmit={(e) => e.preventDefault()} className="recipe-form">
//         {/* שם המתכון */}
//         <div className="input-group">
//           <label>Recipe Name</label>
//           <input
//             type="text"
//             value={recipe.name}
//             onChange={(e) => handleInputChange(e, "name")}
//             placeholder="Enter recipe name"
//           />
//         </div>

//         {/* תיאור */}
//         <div className="input-group">
//           <label>Description</label>
//           <input
//             type="text"
//             value={recipe.description}
//             onChange={(e) => handleInputChange(e, "description")}
//             placeholder="Enter recipe description"
//           />
//         </div>

//         {/* רכיבים */}
//         <div className="ingredients-section">
//           <label>Ingredients</label>
//           {recipe.ingredients.map((ingredient, index) => (
//             <div key={index} className="ingredient-group">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Ingredient Name"
//                 value={ingredient.name}
//                 onChange={(e) => handleIngredientChange(index, e)}
//               />
//               <input
//                 type="text"
//                 name="quantity"
//                 placeholder="Quantity"
//                 value={ingredient.quantity}
//                 onChange={(e) => handleIngredientChange(index, e)}
//               />
//               <input
//                 type="text"
//                 name="unit"
//                 placeholder="Unit (e.g. grams)"
//                 value={ingredient.unit}
//                 onChange={(e) => handleIngredientChange(index, e)}
//               />
//             </div>
//           ))}
//           <button type="button" onClick={handleAddIngredient}>
//             Add Ingredient
//           </button>
//         </div>

//         {/* זמן הכנה */}
//         <div className="input-group">
//           <label>Duration (mins)</label>
//           <input
//             type="number"
//             value={recipe.duration}
//             onChange={(e) => handleInputChange(e, "duration")}
//             placeholder="Enter preparation time"
//           />
//         </div>

//         {/* דרגת קושי */}
//         <div className="input-group">
//           <label>Difficulty</label>
//           <select
//             value={recipe.difficulty}
//             onChange={(e:any) => handleInputChange(e, "difficulty")}
//           >
//             <option value="">Select Difficulty</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>

//         {/* אופן ההכנה */}
//         <div className="instructions-section">
//           <label>Instructions</label>
//           {recipe.instructions.map((instruction, index) => (
//             <div key={index} className="instruction-group">
//               <input
//                 type="text"
//                 name="step"
//                 placeholder="Step description"
//                 value={instruction.step}
//                 onChange={(e) => {
//                   const newInstructions = [...recipe.instructions];
//                   newInstructions[index].step = e.target.value;
//                   setRecipe({ ...recipe, instructions: newInstructions });
//                 }}
//               />
//             </div>
//           ))}
//           <button type="button" onClick={handleAddInstruction}>
//             Add Instruction
//           </button>
//         </div>

//         {/* כפתור שמירה */}
//         <div className="save-button">
//           <button type="button" onClick={handleSave}>
//             Save Recipe
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddRecipeForm;



// import React, { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import axios from "axios";
// import { Category } from "../types";

// interface Ingredient {
//   Name: string;
//   Count: string;
//   Type: string;
// }

// interface RecipeForm {
//   Name: string;
//   Description: string;
//   prepTime: string;
//   Difficulty: 'קל' | 'בינוני' | 'קשה' | '';
//   categoryId: number | '';
//   Ingredients: Ingredient[];
//   Instructions: string;
//   Img: string;
// }

// const AddRecipePage: React.FC = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<RecipeForm>({
//     defaultValues: {
//       Ingredients: [{ Name: "", Count: "", Type: "" }],
//       Difficulty: '',
//       categoryId: '',
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "Ingredients",
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("/api/category");
//         const mapped: Category[] = res.data.map((c: any) => ({
//           id: c.Id,
//           name: c.Name,
//         }));
//         setCategories(mapped);
//       } catch (err) {
//         console.error("Error fetching categories", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const onSubmit = async (data: RecipeForm) => {
//     try {
//       const userId = localStorage.getItem("userId");
//       const recipe = {
//         ...data,
//         UserId: userId ? Number(userId) : null,
//         CategoryId: data.categoryId,
//       };
//       await axios.post("/api/recipe", recipe);
//       alert("המתכון נוסף בהצלחה!");
//       reset();
//     } catch (err) {
//       console.error("Error adding recipe", err);
//       alert("שגיאה בהוספת מתכון");
//     }
//   };

//   if (loading) return <p>טוען קטגוריות...</p>;

//   // כאן הגובה של navbar במידה ויש אחד fixed
//   const NAVBAR_HEIGHT = 80; // שנה לפי הצורך

//   return (
//     <div
//       style={{
//         minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
//         paddingTop: NAVBAR_HEIGHT,
//         display: "flex",
//         justifyContent: "center",
//         backgroundColor: "#f0f0f0",
//         boxSizing: "border-box",
//         overflowY: "auto",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "800px",
//           backgroundColor: "#fff",
//           padding: "2rem",
//           borderRadius: "1rem",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
//           ➕ הוספת מתכון חדש
//         </h2>
//         <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//           {/* שם מתכון */}
//           <div>
//             <label>שם המתכון</label>
//             <input
//               {...register("Name", { required: true })}
//               style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}
//             />
//             {errors.Name && <span style={{ color: "red" }}>שדה חובה</span>}
//           </div>

//           {/* תיאור */}
//           <div>
//             <label>תיאור</label>
//             <textarea
//               {...register("Description")}
//               style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}
//             />
//           </div>

//           {/* זמן הכנה + רמת קושי */}
//           <div style={{ display: "flex", gap: "1rem" }}>
//             <div style={{ flex: 1 }}>
//               <label>⏱ זמן הכנה</label>
//               <input {...register("prepTime")} style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <label>🎯 רמת קושי</label>
//               <select {...register("Difficulty")} style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}>
//                 <option value="">בחר רמה</option>
//                 <option value="קל">קל</option>
//                 <option value="בינוני">בינוני</option>
//                 <option value="קשה">קשה</option>
//               </select>
//             </div>
//           </div>

//           {/* קטגוריה */}
//           <div>
//             <label>🍽 קטגוריה</label>
//             <select {...register("categoryId", { required: true })} style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}>
//               <option value="">בחר קטגוריה</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>{c.name}</option>
//               ))}
//             </select>
//             {errors.categoryId && <span style={{ color: "red" }}>שדה חובה</span>}
//           </div>

//           {/* מרכיבים */}
//           <div>
//             <label>🥕 מרכיבים</label>
//             {fields.map((field, index) => (
//               <div key={field.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
//                 <input
//                   {...register(`Ingredients.${index}.Name` as const, { required: true })}
//                   placeholder="שם"
//                   style={{ flex: 2, border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}
//                 />
//                 <input
//                   {...register(`Ingredients.${index}.Count` as const, { required: true })}
//                   placeholder="כמות"
//                   style={{ flex: 1, border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}
//                 />
//                 <input
//                   {...register(`Ingredients.${index}.Type` as const)}
//                   placeholder="יחידה"
//                   style={{ flex: 1, border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}
//                 />
//                 <button type="button" onClick={() => remove(index)} style={{ color: "red", marginLeft: "auto" }}>הסר</button>
//               </div>
//             ))}
//             <button type="button" onClick={() => append({ Name: "", Count: "", Type: "" })} style={{ color: "blue" }}>➕ הוסף מרכיב</button>
//           </div>

//           {/* הוראות */}
//           <div>
//             <label>📜 הוראות הכנה</label>
//             <textarea {...register("Instructions")} rows={4} style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }} />
//           </div>

//           {/* תמונה */}
//           <div>
//             <label>🖼 כתובת תמונה (URL)</label>
//             <input {...register("Img")} style={{ width: "100%", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }} />
//           </div>

//           {/* כפתור שמירה */}
//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               backgroundColor: "#ec4899",
//               color: "white",
//               padding: "0.75rem",
//               borderRadius: "0.75rem",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "0.2s",
//             }}
//             onMouseOver={e => (e.currentTarget.style.backgroundColor = "#db2777")}
//             onMouseOut={e => (e.currentTarget.style.backgroundColor = "#ec4899")}
//           >
//             שמור מתכון
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddRecipePage;


import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
// import type { Category as LocalCategory } from "../types";
import styles from "../Designs/AddRecipe.module.css";
import { useContext } from "react";
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
  Difficulty: 'קל' | 'בינוני' | 'קשה' | '';
  categoryId: number | '';
  Ingredients: Ingredient[];
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

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RecipeForm>({
    defaultValues: { Ingredients: [{ Name: "", Count: "", Type: "" }], Difficulty: '', categoryId: '' },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "Ingredients" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const res = await axios.get("/api/category");
        const res = await axios.get("http://localhost:8080/api/category");

        const mapped: LocalCategory[] = res.data.map((c: any) => ({ id: c.Id, name: c.Name }));
        setCategories(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // const onSubmit = async (data: RecipeForm) => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const recipe = { ...data, UserId: userId ? Number(userId) : null, CategoryId: data.categoryId };
  //     await axios.post("http://localhost:8080/api/recipe", recipe);
  //     alert("המתכון נוסף בהצלחה!");
  //     reset();
  //   } catch (err) {
  //     console.error(err);
  //     alert("שגיאה בהוספת מתכון");
  //   }
  // };


  const onSubmit = async (data: RecipeForm) => {
    try {
      // const userId = localStorage.getItem("userId");


      // if (!userId) {
      //   alert("משתמש לא מחובר");
      //   return;
      // }



      if (!MyUser) {
        alert("משתמש לא מחובר");
        return;
      }




      if (!data.categoryId) {
        alert("יש לבחור קטגוריה");
        return;
      }


      const recipe = {
        Name: data.Name,                       // string
        Description: data.Description,         // string
        Duration: Number(data.prepTime),       // מומר ל־NUMBER, כמו INTEGER
        Difficulty:
          data.Difficulty === 'קל' ? 1 :
            data.Difficulty === 'בינוני' ? 2 :
              data.Difficulty === 'קשה' ? 3 : 0, // מומר למספר בהתאם לרמת הקושי
        Instructions: [data.Instructions],     // מערך מחרוזות
        UserId: MyUser.id,                     // מזהה המשתמש
        CategoryId: data.categoryId,           // מזהה הקטגוריה
        Img: data.Img,                         // string URL
        Ingridents: data.Ingredients.map(i => ({
          Name: i.Name,
          Count: i.Count,
          Type: i.Type,
        })),
      };


      const res = await axios.post("http://localhost:8080/api/recipe", recipe);
      alert("המתכון נוסף בהצלחה!");
      reset();

    } catch (err: any) {
      console.error(err);
      if (err.response) {
        alert(`שגיאה בהוספת מתכון: ${err.response.data}`);
      } else {
        alert("שגיאה בהוספת מתכון");
      }
    }
  };

  if (loading) return <p>טוען קטגוריות...</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>➕ הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>שם המתכון</label>
          <input {...register("Name", { required: true })} className={styles.input} />
          {errors.Name && <span style={{ color: 'red' }}>שדה חובה</span>}
        </div>

        <div className={styles.formGroup}>
          <label>תיאור</label>
          <textarea {...register("Description")} className={styles.textarea} />
        </div>

        <div className={styles.formGroup}>
          <label>⏱ זמן הכנה</label>
          <input {...register("prepTime")} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>🎯 רמת קושי</label>
          <select {...register("Difficulty")} className={styles.select}>
            <option value="">בחר רמה</option>
            <option value="קל">קל</option>
            <option value="בינוני">בינוני</option>
            <option value="קשה">קשה</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>🍽 קטגוריה</label>
          <select {...register("categoryId", { required: true })} className={styles.select}>
            <option value="">בחר קטגוריה</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <span style={{ color: 'red' }}>שדה חובה</span>}
        </div>

        <div className={styles.formGroup}>
          <label>🥕 מרכיבים</label>
          {fields.map((field, index) => (
            <div key={field.id} className={styles.ingredientRow}>
              <input {...register(`Ingredients.${index}.Name` as const, { required: true })} placeholder="שם" className={styles.input} />
              <input {...register(`Ingredients.${index}.Count` as const, { required: true })} placeholder="כמות" className={styles.input} />
              <input {...register(`Ingredients.${index}.Type` as const)} placeholder="יחידה" className={styles.input} />
              <span onClick={() => remove(index)} className={styles.removeButton}>הסר</span>
            </div>
          ))}
          <span onClick={() => append({ Name: "", Count: "", Type: "" })} className={styles.addIngredient}>➕ הוסף מרכיב</span>
        </div>

        <div className={styles.formGroup}>
          <label>📜 הוראות הכנה</label>
          <textarea {...register("Instructions")} rows={4} className={styles.textarea} />
        </div>

        <div className={styles.formGroup}>
          <label>🖼 כתובת תמונה (URL)</label>
          <input {...register("Img")} className={styles.input} />
        </div>

        <button type="submit" className={styles.button}>שמור מתכון</button>
      </form>
    </div>
  );
};

export default AddRecipe;