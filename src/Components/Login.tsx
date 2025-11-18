// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [UserName, setUserName] = useState("");
//   const [Password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//         const response = await fetch("http://localhost:8080/api/user/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ UserName, Password })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             // אם השרת החזיר שגיאה – נזרוק הודעה
//             throw new Error(data || "Login failed");
//         }

//         console.log("Logged in user:", data);

//         navigate('/home'); 
//         // כאן אפשר לשמור את המשתמש ב־state או בהקשר
//     } catch (err: any) {
//         console.error("Error logging in:", err.message);
//         // כאן אפשר להציג הודעה למשתמש
//     }
// };


//   return (
//     <div>
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={onSubmit}>
//         <div>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={UserName}
//             onChange={(e) => setUserName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={Password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../userContext";
import { useContext } from "react";

const Login = () => {
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setMyUser } = useContext(userContext);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName, Password })
      });

      const data = await response.json();

      if (!response.ok) {
        // אם השרת החזיר שגיאה – הצג את ההודעה ב-state
        setError(data || "שם משתמש או סיסמה שגויים");
        return;
      }

      // // בודקים אם יש dataValues
      // const userData = data.dataValues || data;
      // // שמירה של המשתמש בהקשר
      // setMyUser(data);
      // sessionStorage.setItem("user", JSON.stringify(data)); // אופציונלי אם רוצים שמירה ב-session
      // הוצאת המשתמש הנכון
      const userData = data.dataValues || data;

      // שמירה ב-context
      setMyUser(userData);

      // שמירה ב-session
      sessionStorage.setItem("user", JSON.stringify(userData));


      console.log("Logged in user:", data);
      setError(""); // נקה הודעת שגיאה אם הצליח

      navigate('/Home');
      // כאן אפשר לשמור את המשתמש ב־state או בהקשר
    } catch (err: any) {
      console.error("Error logging in:", err.message);
      setError("שם משתמש או סיסמה שגוי, נסי שנית");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
