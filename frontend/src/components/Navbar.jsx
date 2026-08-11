import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");

    };


    return (

        <nav className="navbar">

            <h2
                className="navbar-logo"
                onClick={() => navigate("/dashboard")}>
                    Expense Tracker
            </h2>


            <div className="navbar-links">

                <button onClick={() =>navigate("/dashboard")}>Dashboard</button>


                <button onClick={() =>navigate("/add-expense")}>Add Expense</button>


                <button onClick={handleLogout}>Logout</button>

            </div>

        </nav>

    );

}

export default Navbar;