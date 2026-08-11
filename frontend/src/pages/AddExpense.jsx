import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, API_BASE_URL } from "../api.js";
import Navbar from "../components/Navbar";
import "./AddExpense.css"

function AddExpense() {

    const navigate = useNavigate()


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!amount || Number(amount) <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }

        if (!category.trim()) {
            setError("Category is required.");
            return;
        }

        if (!description.trim()) {
            setError("Description is required.");
            return;
        }

        if (!paymentMethod.trim()) {
            setError("Payment method is required.");
            return;
        }

        if (!date) {
            setError("Date is required.");
            return;
        }

        setLoading(true);
        


        // const token = localStorage.getItem("access_token");

        const expense = {
            amount: amount,
            category: category,
            description: description,
            payment_method: paymentMethod,
            date: date
        };

        try {

            const response = await apiFetch(
                 `${API_BASE_URL}/api/expenses/`,
                {
                    method: "POST",

                    body: JSON.stringify(expense)
                }
            );

            const data = await response.json();

            // console.log("Status:", response.status);
            // console.log("response", data);

            // const text = await response.text()
            // console.log("Response", text)

            if(response.ok){
                setSuccess("Expense added successfully!");

                setAmount("");
                setCategory("");
                setDescription("");
                setPaymentMethod("");
                setDate("");
            } else{
                setError(data.detail || "Failed to add Expense")
            }

        } catch (error) {

            console.log("Error:", error);
            setError("Something went wrong. Please Try Again.")

        }finally{
            setLoading(false);
        }
    };

    return (
        <div>

            <Navbar />

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


            <div className="add-expense-page">
            <h1>Add Expense</h1>

            <form onSubmit={handleSubmit} className="expense-form">

                <div className="form-group">
                    <label>Amount</label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>

                    <input
                        type="text"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <input
                        type="text"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Payment Method</label>

                    <input
                        type="text"
                        value={paymentMethod}
                        onChange={(e) =>
                            setPaymentMethod(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Expense"}
                </button>

            </form>

            </div>

        </div>
    );
}

export default AddExpense;