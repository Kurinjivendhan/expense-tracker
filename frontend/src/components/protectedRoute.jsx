import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    // console.log("PROTECTED ROUTE RUNNING");

    const token = localStorage.getItem("access_token");

    // console.log("PROTECTED TOKEN:", token);

    if (!token) {
        // console.log("NO TOKEN → LOGIN");

        return <Navigate to="/login" replace />;
    }

    // console.log("TOKEN EXISTS → ALLOW");

    return children;
}

export default ProtectedRoute;