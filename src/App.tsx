import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import SignIn from "./Components/SignIn";
import AllRecipes from "./Components/AllRecipes";
import AddRecipe from "./Components/AddRecipe";
import UserContext from "./userContext";

function App() {
    return (
        <UserContext>
            <Router>
                <Routes>
                    <Route path="/" element={< Home />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/SignIn" element={<SignIn />} />
                    <Route path="/AllRecipes" element={<AllRecipes />} />
                    <Route path="/AddRecipe" element={<AddRecipe />} />
                    <Route path="/Home" element={< Home />} />
                </Routes>
            </Router>
        </UserContext>
    );
}

export default App;
