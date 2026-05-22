const expenseChart = document.getElementById("expenseChart");
const income = document.getElementById('income');
const  expense = document.getElementById('expense');
const balance = document.getElementById('balance');
const categoryList = document.getElementById('categoryList');
const loading = document.getElementById("loading");
// Create function that loads dashboard data from backend - async function that fetches data from backend and updates the dashboard
async function loadDashboard() {
    loading.style.display = "block";
    const token = localStorage.getItem('access');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    try {
        const response = await fetch(
            'http://127.0.0.1:8000/api/summary/',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        const data = await response.json();
        // console.log(data);
        if (response.ok) {
            income.textContent = `₹${data.data.income}`;
            expense.textContent = `₹${data.data.expense}`;
            balance.textContent = `₹${data.data.balance}`;
            const labels = data.data.expense_breakdown.map(
                item => item.category
            );
            const totals = data.data.expense_breakdown.map(
                item => item.total
            );
            new Chart(expenseChart, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets : [
                        {
                            label: "Expenses",
                            data: totals,
                            borderWidth: 1
                        }
                    ]
                }
            });

            data.data.expense_breakdown.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.category} - ₹${item.total}`;
                categoryList.appendChild(li);
                loading.style.display = "none";
            });
        }
        else {
            localStorage.removeItem('access');
            window.location.href = 'index.html';
            loading.style.display = "none";
        }
    }
    catch(error) {
        console.log(error);
        loading.style.display = "none";

    }
}

loadDashboard();
// logout function //
function logout(){
    localStorage.clear();
    window.location.href = 'index.html';
}