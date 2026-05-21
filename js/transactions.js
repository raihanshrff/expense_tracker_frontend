const transactionForm = document.getElementById('transactionForm');
const transactionTableBody = document.getElementById('transactionTableBody');

async function loadTransactions(){
    const token = localStorage.getItem('access');
    
    if(!token){
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(
            'http://127.0.0.1:8000/api/transactions/',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        console.log(data);
        if(response.ok){
            // clear existing table rows (if any)
             transactionTableBody.innerHTML = '';
             data.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>₹${transaction.title}</td>
                    <td>₹${transaction.amount}</td>
                    <td>₹${transaction.category}</td>
                    <td>₹${transaction.type}</td>
                    <td>₹${transaction.date}</td>
                    <td>
                        <button onclick= "deletetransaction(${transaction.id})">Delete</button>
                    </td>
                `;
                transactionTableBody.appendChild(row);

             });
        }
        else {
                localStorage.removeItem('access');
                window.location.href = 'index.html';
             }
    }
    catch(error){
        console.log(error);
    }
}
loadTransactions();
transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const transactionData = {
        title: document.getElementById('title').value,
        amount: document.getElementById('amount').value,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
        date: document.getElementById('date').value

    };
    try {
        const response = await fetch(
            'http://127.0.0.1:8000/api/transactions/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transactionData)
            }
        );
        if(response.ok){
            transactionForm.reset();
            loadTransactions();
        }
        else {
            // console.log('Failed to add transaction');
            const errorData = await response.json();
            console.log(errorData);
        }
    }
    catch(error){
        console.log(error);
    }
});
// delete transaction//
async function deletetransaction(id){
    const token = localStorage.getItem("access");

    const confirmDelete = confirm("Are you sure");
    if(!confirmDelete){
        return;
    }
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/transactions/${id}/`,
            {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        if(response.ok){
            loadTransactions();
        }
        else {
            console.log("Failed to delete transaction");
        }
    }
    catch(error){
        console.log(error)
    }
}