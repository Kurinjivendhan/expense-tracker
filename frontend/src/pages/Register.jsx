import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { apiFetch, API_BASE_URL } from "../api.js";



function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        setLoading(true);


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/register/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


            const data = await response.json();

            console.log("Register Status:", response.status);
            console.log("Register Response:",  JSON.stringify(data, null, 2));


            if (response.ok) {

                setSuccess(
                    "Account created successfully!"
                );

                setUsername("");
                setPassword("");
                setConfirmPassword("");


                setTimeout(() => {
                    navigate("/login");
                }, 1000);


            } else {

                const errorMessage =
                    data.username?.[0] ||
                    data.password?.[0] ||
                    "Registration failed.";

                setError(errorMessage);

            }

        } catch (error) {

            console.log("Register Error:", error);

            setError(
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="register-page">

            <div className="register-card">

                <h1>Create Account</h1>

                <p className="register-subtitle">
                    Create an account to start tracking
                    your expenses.
                </p>


                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            placeholder="Enter username"
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            placeholder="Enter password"
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm password"
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >{loading
                            ? "Creating Account..."
                            : "Sign Up"}
                    </button>

                </form>


                <div className="login-link">

                    <p>
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")}>Login
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Register;