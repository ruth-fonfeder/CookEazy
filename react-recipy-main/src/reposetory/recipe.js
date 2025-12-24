const Ingridents = require("../model/ingridents");
const Instructions = require("../model/instructions");
const Recipe = require("../model/recipe");

const GetRecipeDb = async (Id) => {
    return Recipe.findOne({ where: { Id }, include: [Ingridents, Instructions] });
}

const GetRecipesDb = () => {
    return Recipe.findAll({ include: [Ingridents, Instructions] });
}

const { Op } = require("sequelize"); // צריך לייבא את זה אם לא קיים

// פונקציה חדשה לסינון מתכונים לפי פרמטרים
const GetFilteredRecipesDb = async ({ CategoryId, Duration, Difficulty, UserId }) => {
    const whereClause = {};

    // אם נשלח CategoryId, מוסיפים את זה ל־where
    if (CategoryId) whereClause.Categoryid = CategoryId;

    // אם נשלח Duration, מחזירים רק מתכונים שהזמן שלהם קטן או שווה ל־Duration
    if (Duration) whereClause.Duration = Duration ;
    console.log("Difficulty received:", Difficulty);

    // אם נשלח Difficulty, מסננים לפי הקושי
    if (Difficulty) whereClause.Difficulty = Difficulty;
    console.log("Difficulty received:", Difficulty);

    // אם נשלח UserId, מסננים לפי מי שיצר את המתכון
    if (UserId) whereClause.UserId = UserId;

    return Recipe.findAll({
        where: whereClause,
        include: [Ingridents, Instructions] // תמיד נכלול מרכיבים והוראות
    });
};


const AddRecipyDB = async (recipy) => {
    // create() עם include – Sequelize ממלא את ה-RecipeId בכל Instruction ו-Ingrident
    return await Recipe.create(recipy, {
      include: [
        { model: Instructions }, // כל הוראה תקבל את RecipeId של המתכון הזה
        { model: Ingridents }    // כל מרכיב יקבל את RecipeId
      ]
    });
  };

const EditRecipyDb = async (recipe) => {
  const recipeUpdate = await GetRecipeDb(recipe.Id);
  if (!recipeUpdate) throw new Error("Recipe not found");

  // 1️⃣ מוחקים הוראות קיימות
  await Instructions.destroy({
      where: { RecipeId: recipe.Id }
  });

  // 2️⃣ מוחקים מרכיבים קיימים
  await Ingridents.destroy({
      where: { RecipeId: recipe.Id }
  });

  // 3️⃣ מעדכנים את טבלת המתכון עצמו
  await recipeUpdate.update({
      Name: recipe.Name,
      Img: recipe.Img,
      Description: recipe.Description,
      Duration: recipe.Duration,
      Difficulty: recipe.Difficulty,
      Categoryid: recipe.Categoryid
  });

  // 4️⃣ מוסיפים הוראות חדשות
  if (recipe.Instructions && recipe.Instructions.length > 0) {
      await Instructions.bulkCreate(
          recipe.Instructions.map(i => ({
              Name: i.Name,
              RecipeId: recipe.Id
          }))
      );
  }

  // 5️⃣ מוסיפים מרכיבים חדשים
  if (recipe.Ingridents && recipe.Ingridents.length > 0) {
      await Ingridents.bulkCreate(
          recipe.Ingridents.map(i => ({
              Name: i.Name,
              Count: i.Count,
              Type: i.Type,
              RecipeId: recipe.Id
          }))
      );
  }

  return await GetRecipeDb(recipe.Id); // מחזיר את המתכון המעודכן
};

const DeleteDb = (Id) => {
    return Recipe.destroy({ where: { Id } })
}

module.exports = { GetRecipeDb, AddRecipyDB, EditRecipyDb, DeleteDb, GetRecipesDb , GetFilteredRecipesDb}
