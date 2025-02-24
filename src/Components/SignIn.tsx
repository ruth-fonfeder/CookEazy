import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ייבוא axios
import "../Designs/SiginIn.css";
import { user } from "../types";
import { userContext } from "../useContext";


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
    const onSubmit = async (data:any) => {
        console.log(data)
        try {
            const response = await axios.post<user>("http://localhost:8080/api/user/sighin", data, {
                headers: { "Content-Type": "application/json" },
              });

            if (response.status === 201) {
                const user = response.data;
                console.log("User created:", user);
                navigate("/Home"); // לאחר הצלחה, מעביר לדף הבית
            } else {
                console.log("Error creating user, try again.");
            }
        } catch (error) {
            console.error("Error signing up:", error);
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
};

export default SignIn;

//gpt1
// import React from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../Designs/SiginIn.css";

// // סכמת ולידציה עם yup
// const schema = yup.object().shape({
//     UserName: yup.string().required("שם משתמש הוא שדה חובה").min(4, "שם משתמש חייב להיות לפחות 4 תווים"),
//     Password: yup.string().required("סיסמה היא שדה חובה").min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
//     Name: yup.string().required("שם הוא שדה חובה"),
//     Phone: yup.string().matches(/^\d{10}$/, "מספר טלפון חייב להיות בן 10 ספרות").required("טלפון הוא שדה חובה"),
//     Email: yup.string().required("אימייל הוא שדה חובה").email("אימייל לא חוקי"),
//     Tz: yup.string().matches(/^\d{9}$/, "תעודת זהות חייבת להכיל 9 ספרות").required("תעודת זהות היא שדה חובה"),
// });

// const SignIn = () => {
//     const navigate = useNavigate();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm({
//         resolver: yupResolver(schema),
//     });

//     // שליחת הנתונים לשרת
//     const onSubmit = async (data: { UserName: string; Password: string; Name: string; Phone: string; Email: string; Tz: string }) => {
//         console.log("Submitting data:", data);

//         try {
//             const response = await axios.post("http://localhost:8080/api/user/signin", data, {
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.status === 201) {
//                 console.log("User created:", response.data);
//                 navigate("/Home"); // מעביר לדף הבית אחרי הצלחה
//             }
//         } catch (error: any) {
//             console.error("Error signing up:", error.response?.data || error.message);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
//                 <h1>Sign Up</h1>

//                 <label>UserName:</label>
//                 <input type="text" {...register("UserName")} />
//                 {errors.UserName && <p className="text-red-500">{errors.UserName.message}</p>}

//                 <label>Password:</label>
//                 <input type="password" {...register("Password")} />
//                 {errors.Password && <p className="text-red-500">{errors.Password.message}</p>}

//                 <label>Name:</label>
//                 <input type="text" {...register("Name")} />
//                 {errors.Name && <p className="text-red-500">{errors.Name.message}</p>}

//                 <label>Phone:</label>
//                 <input type="text" {...register("Phone")} />
//                 {errors.Phone && <p className="text-red-500">{errors.Phone.message}</p>}

//                 <label>Email:</label>
//                 <input type="email" {...register("Email")} />
//                 {errors.Email && <p className="text-red-500">{errors.Email.message}</p>}

//                 <label>TZ (ID):</label>
//                 <input type="text" {...register("Tz")} />
//                 {errors.Tz && <p className="text-red-500">{errors.Tz.message}</p>}

//                 <button type="submit">Sign Up 🤍</button>
//             </form>
//         </div>
//     );
// };

// export default SignIn;
