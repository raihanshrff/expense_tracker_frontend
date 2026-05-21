const income = document.getElementById('income');
const  expense = document.getElementById('expense');
const balance = document.getElementById('balance');
const categoryList = document.getElementById('categoryList');
// Create function that loads dashboard data from backend - async function that fetches data from backend and updates the dashboard
async function loadDashboard() {
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

            data.data.expense_breakdown.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.category} - ₹${item.total}`;
                categoryList.appendChild(li);
            });
        }
        else {
            localStorage.removeItem('access');
            window.location.href = 'index.html';
        }
    }
    catch(error) {
        console.log(error);

    }
}

loadDashboard();