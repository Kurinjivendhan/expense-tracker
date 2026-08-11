import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import ProtectedRoute from "./components/protectedRoute";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>

                <Route
                    path="/login" element={<Login />}/>

                <Route path="/register" element={<Register />} />

                <Route path="/dashboard"element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

                <Route
                    path="/add-expense"element={ <ProtectedRoute><AddExpense /> </ProtectedRoute>}/>

                <Route
                    path="/edit-expense/:id" element={<ProtectedRoute> <EditExpense/></ProtectedRoute>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;