
const { LoginDb, SighinDb } = require("../reposetory/user");

const Login = async (req, res) => {
    try {
        const { UserName, Password } = req.body;

        if (!UserName || !Password) {
            return res.status(400).send('Missing username or password');
        }

        const findUser = await LoginDb(UserName, Password);

        if (!findUser) {
            return res.status(401).send('User not found!');
        }

        // מחזירים את המשתמש בלי הסיסמה
        const { Password: pwd, ...userWithoutPassword } = findUser;
        return res.send(userWithoutPassword);

    } catch (err) {
        if (err?.errors && err.errors.length > 0) {
            return res.status(400).send(err.errors[0].message);
        }
        return res.status(500).send(err.message || 'Unknown error');
    }
};

const Sighin = async (req, res) => {
    try {
        console.log(req.body);
        const { UserName, Password, Name, Phone, Email, Tz } = req.body;

        if (!UserName || !Name || !Password || !Phone || !Email || !Tz) {
            return res.status(400).send('לא מולאו כל הפרטים');
        }

        const newUser = await SighinDb({ UserName, Password, Name, Phone, Email, Tz });
        return res.send(newUser);

    } catch (err) {
        if (err?.errors && err.errors.length > 0) {
            return res.status(400).send(err.errors[0].message);
        }
        return res.status(500).send(err.message || 'Unknown error');
    }
};

module.exports = { Login, Sighin };
