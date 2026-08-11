import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, API_BASE_URL } from "../api.js";
import { Doughnut } from "react-chartjs-2";
import Navbar from "../components/Navbar";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("All");

    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount),
        0
    );

    const expenseCount = expenses.length;

    const highestExpense =
        expenses.length > 0
            ? Math.max(
                ...expenses.map(
                    (expense) =>
                        Number(expense.amount)
                )
            )
            : 0;

    const categoryTotals = {};

    expenses.forEach((expense) => {

        const category = expense.category;
        const amount = Number(expense.amount);

        if (categoryTotals[category]) {

            categoryTotals[category] += amount;

        } else {

            categoryTotals[category] = amount;

        }

    });


    const categories = Object.keys(categoryTotals);


    const paymentMethods = [
        ...new Set(
            expenses.map(
                (expense) =>
                    expense.payment_method
            )
        )
    ];



    const filteredExpenses = expenses.filter(
        (expense) => {

            const searchText =
                search.trim().toLowerCase();


            const expenseCategory =
                expense.category
                    ?.trim()
                    .toLowerCase() || "";


            const expenseDescription =
                expense.description
                    ?.trim()
                    .toLowerCase() || "";


            const selectedCategory =
                categoryFilter
                    .trim()
                    .toLowerCase();


            const matchesSearch =
                expenseCategory.includes(searchText) ||
                expenseDescription.includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                expenseCategory === selectedCategory;


            const expensePayment =
                expense.payment_method
                    ?.trim()
                    .toLowerCase() || "";


            const selectedPayment =
                paymentFilter
                    .trim()
                    .toLowerCase();


            const matchesPayment =
                selectedPayment === "all" ||
                expensePayment === selectedPayment;


            const expenseDate =
                new Date(expense.date);

            const now = new Date();


            const matchesDate =
                dateFilter === "All" ||

                (
                    dateFilter === "Today" &&
                    expenseDate.toDateString() ===
                    now.toDateString()
                ) ||

                (
                    dateFilter === "This Month" &&
                    expenseDate.getMonth() ===
                    now.getMonth() &&
                    expenseDate.getFullYear() ===
                    now.getFullYear()
                ) ||

                (
                    dateFilter === "This Year" &&
                    expenseDate.getFullYear() ===
                    now.getFullYear()
                );


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPayment &&
                matchesDate
            );

        }
    );


    const chartColors = [
    "#4F46E5",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#A855F7",
    "#EC4899",
    "#84CC16"
];
 
    const chartData = {

        labels: Object.keys(categoryTotals),

        datasets: [
            {
                label: "Expenses",

                data: Object.values(categoryTotals),

                 backgroundColor: Object.keys(categoryTotals).map(
                (_, index) =>
                    chartColors[index % chartColors.length]),
                borderWidth:2,
                spacing: 3
            }
        ]

    };




    const deleteExpense = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this expense?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await apiFetch(
                `${API_BASE_URL}/api/expenses/${id}/`,
                {
                    method: "DELETE"
                }
            );


            console.log(
                "Delete status:",
                response.status
            );


            if (response.ok) {

                setExpenses(
                    expenses.filter(
                        (expense) =>
                            expense.id !== id
                    )
                );

            } else {

                console.log(
                    "Delete failed:",
                    await response.text()
                );

            }

        } catch (error) {

            console.log(
                "Delete error:",
                error
            );

        }

    };



    useEffect(() => {

        const getExpenses = async () => {

            setLoading(true);
            setError("");


            try {

                const response = await apiFetch(
                    `${API_BASE_URL}/api/expenses/`,
                    {
                        method: "GET"
                    }
                );


                const data =
                    await response.json();


                console.log(
                    "GET Status:",
                    response.status
                );


                if (response.ok) {

                    setExpenses(data);

                } else {

                    setError(
                        data.detail ||
                        "Failed to load expenses."
                    );

                }


            } catch (error) {

                console.log(
                    "Error:",
                    error
                );

                setError(
                    "Failed to load expenses."
                );

            } finally {

                setLoading(false);

            }

        };


        getExpenses();

    }, []);



    const handleLogout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        navigate("/login");

    };


    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <h1>
                    Dashboard
                </h1>


                <div className="dashboard-actions">

                    <button
                        onClick={() =>
                            navigate(
                                "/add-expense"
                            )
                        }
                    >
                        + Add Expense
                    </button>


                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            
            {loading && (
                <p>
                    Loading expenses...
                </p>
            )}



            {error && (
                <p>
                    {error}
                </p>
            )}


     

            <h2>
                Expense Summary
            </h2>


            <div className="summary-container">

                <div className="summary-card">

                    <h3>
                        Total Spending
                    </h3>

                    <p>
                        ₹{totalExpenses}
                    </p>

                </div>


                <div className="summary-card">

                    <h3>
                        Total Expenses
                    </h3>

                    <p>
                        {expenseCount}
                    </p>

                </div>


                <div className="summary-card">

                    <h3>
                        Highest Expense
                    </h3>

                    <p>
                        ₹{highestExpense}
                    </p>

                </div>

            </div>


         

            <h2>
                Category Spending
            </h2>


            <div className="category-container">

                {Object.entries(
                    categoryTotals
                ).map(
                    ([category, amount]) => (

                        <div
                            className="category-item"
                            key={category}
                        >

                            <strong>
                                {category}
                            </strong>

                            <p>
                                ₹{amount}
                            </p>

                        </div>

                    )
                )}

            </div>




            <h2>
                Spending by Category
            </h2>


            <div className="chart-container">

                {Object.keys(categoryTotals)
                    .length > 0 ? (

                    <Doughnut
                        data={chartData}
                    />

                ) : (

                    <p>
                        No data available for chart.
                    </p>

                )}

            </div>




            <h2>
                Search & Filter
            </h2>


            <div className="filter-container">


                <input
                    type="text"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />



                <select
                    value={categoryFilter}
                    onChange={(e) => {

                        const selectedCategory =
                            e.target.value;


                        setCategoryFilter(
                            selectedCategory
                        );


                        if (
                            selectedCategory ===
                            "All"
                        ) {

                            setSearch("");

                        } else {

                            setSearch(
                                selectedCategory
                            );

                        }

                    }}
                >

                    <option value="All">
                        All Categories
                    </option>


                    {categories.map(
                        (category) => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>

                        )
                    )}

                </select>


                

                <select
                    value={paymentFilter}
                    onChange={(e) =>
                        setPaymentFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All Payment Methods
                    </option>


                    {paymentMethods.map(
                        (method) => (

                            <option
                                key={method}
                                value={method}
                            >
                                {method}
                            </option>

                        )
                    )}

                </select>


           

                <select
                    value={dateFilter}
                    onChange={(e) =>
                        setDateFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All Dates
                    </option>

                    <option value="Today">
                        Today
                    </option>

                    <option value="This Month">
                        This Month
                    </option>

                    <option value="This Year">
                        This Year
                    </option>

                </select>

            </div>



            <h2>
                My Expenses
            </h2>


            {loading ? (

                <p>
                    Loading Expenses...
                </p>

            ) : error ? (

                <p>
                    {error}
                </p>

            ) : filteredExpenses.length === 0 ? (

                <p>
                    No Expenses Found
                </p>

            ) : (

                <div className="expenses-container">

                    {filteredExpenses.map(
                        (expense) => (

                            <div
                                className="expense-card"
                                key={expense.id}
                            >

                                <div className="expense-header">

                                    <h3>
                                        {expense.category}
                                    </h3>


                                    <span className="expense-amount">
                                        ₹{expense.amount}
                                    </span>

                                </div>


                                <p className="expense-description">

                                    {expense.description}

                                </p>


                                <div className="expense-details">

                                    <span>
                                        💳{" "}
                                        {
                                            expense.payment_method
                                        }
                                    </span>


                                    <span>
                                        📅{" "}
                                        {expense.date}
                                    </span>

                                </div>


                                <div className="expense-actions">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/edit-expense/${expense.id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            deleteExpense(
                                                expense.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Dashboard;