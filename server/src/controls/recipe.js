const { GetRecipeDb, AddRecipyDB, EditRecipyDb, DeleteDb, GetRecipesDb } = require("../reposetory/recipe");


const { GetFilteredRecipesDb } = require("../reposetory/recipe");

const GetAllRecipe = (req, res) => {
    // נביא את כל הפרמטרים מה־query string (מה URL)
    const { CategoryId, Duration, Difficulty, UserId } = req.query;

    GetFilteredRecipesDb({ CategoryId, Duration, Difficulty, UserId })
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors?.[0]) {
                return res.status(400).send(err.errors[0].message)
            }
            return res.status(400).send(err)
        });
};

const GetRecipe = (req, res) => {
    const { Id } = req.params;
    GetRecipeDb(Id)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}

const AddRecipy = (req, res) => {
    const {
        Name, UserId, Img, Duration, Difficulty, Description,
        Ingridents, Instructions, Categoryid // אפשר להשאיר כאן אך לא חובה
    } = req.body;

    // בודקים רק את השדות החיוניים באמת
    if (!Name || !UserId || !Img || !Duration || !Difficulty || !Description || !Ingridents || !Instructions) {
        return res.status(400).send('המידע שנשלח לא תקין');
    }

    // בונים את האובייקט לשליחה למסד הנתונים
    const newRecipe = {
        Name,
        UserId,
        Img,
        Duration,
        Difficulty,
        Description,
        Ingridents,
        Instructions
    };

    // אם Categoryid קיים נעדכן אותו, אם לא – מתעלמים
    if (Categoryid) newRecipe.Categoryid = Categoryid;

    AddRecipyDB(newRecipe)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors?.[0]) {
                return res.status(400).send(err.errors[0].message);
            }
            return res.status(400).send(err);
        });
};



const EditRecipy = (req, res) => {
    const { Id,
        Name, UserId, Categoryid, Img, Duration, Difficulty, Description,
        Ingridents, Instructions } = req.body;

    if (!Id || !Name || !UserId || !Categoryid || !Img || !Duration || !Difficulty || !Description || !Ingridents || !Instructions) {
        // לא נשלח מידע
        return res.status(400).send('המידע שנשלח לא תקין')
    };

    const updateRecipe = {
        Id, Name, Categoryid, Img, Duration, Difficulty,
        Description, Ingridents, Instructions
    };
    EditRecipyDb(updateRecipe)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })

}

const Delete = (req, res) => {
    const { Id } = req.params;
    DeleteDb(Id)
        .then(_ => res.send('ok'))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })

}

module.exports = { Delete, EditRecipy, AddRecipy, GetAllRecipe, GetRecipe };