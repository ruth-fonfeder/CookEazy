import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const welcomePage = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <h1>ברוכה הבאה לאפליקציית המתכונים 🍲</h1>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            כניסה
          </Button>
        </Link>
        <Link to="/SignIn" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="secondary">
            הרשמה
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default welcomePage;