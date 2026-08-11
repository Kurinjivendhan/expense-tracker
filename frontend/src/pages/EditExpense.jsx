import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch, API_BASE_URL } from "../api.js";
import Navbar from "../components/Navbar.jsx";
import "./EditExpense.css";


function EditExpense() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [date, setDate] = useState("");

    // console.log("Expense ID from URL:", id);

    useEffect(() => {

        const getExpense = async () => {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("access_token");

            try {

                const response = await apiFetch(
                    `http://127.0.0.1:8000/api/expenses/${id}/`,
                    {
                        method: "GET",
                    })

                const data = await response.json();

                // console.log("GET Response:", data);

                if (response.ok) {

                    setAmount(data.amount);
                    setCategory(data.category);
                    setDescription(data.description);
                    setPaymentMethod(data.payment_method);
                    setDate(data.date);

                } else{
                    setError(data.detail || "Failed to load expenses.")
                }

            } catch (error) {

                console.log("GET Error:", error);
                setError("Something went wrong while loading the expense.")

            } finally{
                setLoading(false);
            }
        };

        getExpense();

    }, [id]);


    const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // const token = localStorage.getItem("access_token");


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

    

    const updatedExpense = {
        amount: amount,
        category: category,
        description: description,
        payment_method: paymentMethod,
        date: date
    };

    try {

        const response = await apiFetch(
            `http://127.0.0.1:8000/api/expenses/${id}/`,
            {
                method: "PATCH",


                body: JSON.stringify(updatedExpense)
            }
        );

        // console.log(
        //     "PATCH URL:",
        //     `http://127.0.0.1:8000/api/expenses/${id}/`
        // );

        // console.log("PATCH Status:", response.status);

        const data = await response.json();

        // console.log("PATCH Response:", data);

        if (response.ok) {

            setSuccess("Expense updated successfully!");
             setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
            
        }else{
            setError(data.detail || "Failed to update expense.");
        }

    } catch (error) {

        console.log("PATCH Error:", error);
        setError("Something went wrong. Please Try Again.")

    }
    finally {
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
            <h1>Edit Expense</h1>

            <form onSubmit={handleSubmit} className="expense-form">

                <div className="form-group">
                    <label>Amount</label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>

                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <button type="submit"disabled={loading}>
                    {loading ? "Updating..." : "Update Expense"}
                </button>

            </form>

            </div>

        </div>
    );
}

export default EditExpense;