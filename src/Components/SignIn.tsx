import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ייבוא axios
import "../Designs/SiginIn.css";
import { user } from "../types";
import { userContext } from "../userContext";


// הגדרת הסכמת וולידציה עם yup
const schema = yup.object().shape({
    username: yup.string().required("שם משתמש הוא שדה חובה").min(4, "שם משתמש חייב להיות לפחות 4 תווים"),
    password: yup.string().required("סיסמה היא שדה חובה").min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
    name: yup.string().required("שם הוא שדה חובה"),
    phone: yup.string().required("טלפון הוא שדה חובה"),
    email: yup.string().required("אימייל הוא שדה חובה").email("אימייל לא חוקי"),
    tz: yup.string().required("תעודת זהות היא שדה חובה").min(9, "תעודת זהות חייבת להכיל לפחות 9 תווים"),
});

const SignIn = () => {
    const { setMyUser } = useContext(userContext);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // פונקציה שתטפל בנתונים לאחר שליחת הטופס
    const onSubmit = async (data: any) => {
        console.log(data)

        // const response = await axios.post<user>("http://localhost:8080/api/user/sighin", data, {
        //     headers: { "Content-Type": "application/json" },
        //   });

        try {
            const response = await axios.post<user>('http://localhost:8080/api/user/sighin',
                {
                    username: data.username,
                    password: data.password,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    tz: data.tz,
                }
            );
            console.log('✅ המשתמש נרשם בהצלחה:', response.data);
            setMyUser({
                id: response.data.id,
                password: response.data.password,
                name: response.data.name,
                username: response.data.username,
                phone: response.data.phone,
                email: response.data.email,
                tz: response.data.tz
            });
            navigate('/Home');  // ניווט לאחר ההתחברות
        } catch (error: any) {
            if (error.response) {
                console.error("❌ שגיאת שרת:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("⚠️ שגיאת רשת: אין תגובה מהשרת");
            } else {
                console.error("🔴 שגיאה לא צפויה:", error.message);
            }
        }

    };

    return (

        <div className="flex justify-center items-center h-screen bg-gray-100">

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1>Sign Up</h1>

                {/* שדה שם משתמש */}
                <label>UserName:</label>
                <input type="text" {...register("username")} />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}

                {/* שדה סיסמה */}
                <label>Password:</label>
                <input type="password" {...register("password")} />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                {/* שדה שם */}
                <label>Name:</label>
                <input type="text" {...register("name")} />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                {/* שדה טלפון */}
                <label>Phone:</label>
                <input type="text" {...register("phone")} />
                {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

                {/* שדה אימייל */}
                <label>Email:</label>
                <input type="email" {...register("email")} />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                {/* שדה תעודת זהות */}
                <label>TZ (ID):</label>
                <input type="text" {...register("tz")} />
                {errors.tz && <p className="text-red-500">{errors.tz.message}</p>}

                <button type="submit">Sign Up 🤍</button>
            </form>
        </div>
    );

}
    export default SignIn;

// import React, { useContext, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // ייבוא axios
// import "../Designs/SiginIn.css";
// import { user } from "../types";
// import { userContext } from "../useContext";

// // הגדרת הסכמת וולידציה עם yup
// const schema = yup.object().shape({
//     username: yup.string().required("שם משתמש הוא שדה חובה").min(4, "שם משתמש חייב להיות לפחות 4 תווים"),
//     password: yup.string().required("סיסמה היא שדה חובה").min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
//     name: yup.string().required("שם הוא שדה חובה"),
//     phone: yup.string().required("טלפון הוא שדה חובה"),
//     email: yup.string().required("אימייל הוא שדה חובה").email("אימייל לא חוקי"),
//     tz: yup.string().required("תעודת זהות היא שדה חובה").min(9, "תעודת זהות חייבת להכיל לפחות 9 תווים"),
// });

// const SignIn = () => {
//     const { setMyUser } = useContext(userContext);
//     const [msg, setMsg] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm({
//         resolver: yupResolver(schema),
//     });

//     // פונקציה שתטפל בנתונים לאחר שליחת הטופס
//     const onSubmit = async (data: any) => {
//         console.log(data);
//         try {
//             const response = await axios.post<user>("http://localhost:8080/api/user/sighin", data, {
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.status === 201) {
//                 const user = response.data;
//                 console.log("User created:", user);
//                 navigate("/Home"); // לאחר הצלחה, מעביר לדף הבית
//             } else {
//                 console.log("Error creating user, try again.");
//             }
//         } catch (error) {
//             console.error("Error signing up:", error);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
//                 <h1>Sign Up</h1>

//                 {/* שדה שם משתמש */}
//                 <div className="input-container">
//                     <input type="text" placeholder=" " {...register("username")} />
//                     <label>UserName</label>
//                 </div>
//                 {errors.username && <p className="text-red-500">{errors.username.message}</p>}

//                 {/* שדה סיסמה */}
//                 <div className="input-container">
//                     <input type="password" placeholder=" " {...register("password")} />
//                     <label>Password</label>
//                 </div>
//                 {errors.password && <p className="text-red-500">{errors.password.message}</p>}

//                 {/* שדה שם */}
//                 <div className="input-container">
//                     <input type="text" placeholder=" " {...register("name")} />
//                     <label>Name</label>
//                 </div>
//                 {errors.name && <p className="text-red-500">{errors.name.message}</p>}

//                 {/* שדה טלפון */}
//                 <div className="input-container">
//                     <input type="text" placeholder=" " {...register("phone")} />
//                     <label>Phone</label>
//                 </div>
//                 {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

//                 {/* שדה אימייל */}
//                 <div className="input-container">
//                     <input type="email" placeholder=" " {...register("email")} />
//                     <label>Email</label>
//                 </div>
//                 {errors.email && <p className="text-red-500">{errors.email.message}</p>}

//                 {/* שדה תעודת זהות */}
//                 <div className="input-container">
//                     <input type="text" placeholder=" " {...register("tz")} />
//                     <label>TZ (ID)</label>
//                 </div>
//                 {errors.tz && <p className="text-red-500">{errors.tz.message}</p>}

//                 <button type="submit">Sign Up 🤍</button>
//             </form>
//         </div>
//     );
// };

// export default SignIn;
