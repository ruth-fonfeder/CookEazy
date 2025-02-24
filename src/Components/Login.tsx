import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import "../Designs/login.css";
import SignIn from "./SignIn";

const schema = yup.object().shape({
    username: yup
        .string()
        .required("שם משתמש הוא שדה חובה")
        .test('not-email', 'שם המשתמש לא יכול להיות כתובת מייל', value => {
            return !/\S+@\S+\.\S+/.test(value); // בודק אם זה לא כתובת מייל
        }),
    password: yup
        .string()
        .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
        .required("סיסמה היא שדה חובה"),
});

const Login = () => {
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: {username:string;password:string}) => {
        try {
            const response = await fetch("http://localhost:8080/api/user/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    UserName: data.username,
                    Password: data.password,
                }),
            });
            
            if (response.ok) {
                const user = await response.json();
                console.log("User found:", user);
                navigate("/Home"); // מעביר לדף הבית
            } else {
                console.log("User not found, redirecting to sign-up");
                navigate("/SignIn"); // מעביר לדף הרשמה
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1>CookEazy🧁</h1>

                <label>UserName:</label>
                <input
                    type="text"
                    {...register("username")}
                />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}

                <label>Password:</label>
                <input
                    type="password"
                    {...register("password")}
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                <button type="submit" onClick={SignIn} className="signup-button">
                    Login 🤍
                    
                </button>
              
            </form>
        </div>
    );
};

export default Login;
