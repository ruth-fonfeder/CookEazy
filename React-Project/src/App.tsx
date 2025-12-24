import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import SignIn from "./Components/SignIn";
import AllRecipes from "./Components/AllRecipes";
import AddRecipe from "./Components/AddRecipe";
import UserContext from "./userContext";
import MyRecipe from "./Components/MyRecipe";
import UpdateRecipe from "./Components/UpdateRecipe";
import RecipeDetails from "./Components/RecipeDetails";

function App() {
    return (
        <UserContext>
            <Router>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/SignIn" element={<SignIn />} />
                    <Route path="/AllRecipes" element={<AllRecipes />} />
                    <Route path="/AddRecipe" element={<AddRecipe />} />
                    <Route path="/Home" element={< Home />} />
                    <Route path="/MyRecipe" element={< MyRecipe />} />
                    <Route path="/UpdateRecipe/:id" element={< UpdateRecipe />} />
                    <Route path="/RecipeDetails/:id" element={<RecipeDetails />} />
                </Routes>
            </Router>
        </UserContext>
    );
}

export default App;
