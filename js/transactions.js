
let editTransactionId = null;
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
                    <td>${transaction.title}</td>
                    <td>₹${transaction.amount}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.type}</td>
                    <td>${transaction.date}</td>
                    <td>
                        <button onclick= "editTransaction(
                            ${transaction.id},
                            '${transaction.title}',
                            ${transaction.amount},
                            '${transaction.category}',
                            '${transaction.type}',
                            '${transaction.date}')"
                            >Edit</button>
                            <button onclick="deletetransaction(${transaction.id})">Delete</button>
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
// apply filters //
async function applyFilters() {
    const token = localStorage.getItem("access");
    let url = "http://127.0.0.1:8000/api/transactions/";
    const category = document.getElementById("filterCategory").value;
    const type = document.getElementById("filterType").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const queryParams = new URLSearchParams();
    if(category){
        queryParams.append(
            "category",category
        );
    }
    if(type){
        queryParams.append(
            "type",type
        );
    }
    if(startDate){
        queryParams.append(
            "start_date",startDate
        );
    }
    if(endDate){
        queryParams.append(
            "end_date",endDate
        );
    }
    url += `?${queryParams.toString()}`;
    try {
        const response = await fetch(
            url,
            {
                method: 'GET',
                headers:{
                    "Authorization": `Bearer ${token}`
                }

            }
        );
        const data = await response.json();
        if(response.ok){
            transactionTableBody.innerHTML = "";
            data.forEach(transaction => {
                const row = document.createElement("tr");
            row.innerHTML= `
                <td>${transaction.title}</td>
                <td>₹${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>${transaction.type}</td>
                <td>${transaction.date}</td>
                <td> 
                    <button onclick="editTransaction(${transaction.id},
                                    '${transaction.title}',
                                    ${transaction.amount},
                                    '${transaction.category}',
                                    '${transaction.type}',
                                    '${transaction.date}')">Edit</button>
                    <button onclick="deleteTransaction(${transaction.id})">Delete</button>
                </td>`;
                transactionTableBody.appendChild(row);
            });
        }
    }
    catch(error){
        console.log(error);
    }
}
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
        let url = 'http://127.0.0.1:8000/api/transactions/';
        let method = 'POST';
        if(editTransactionId){
            url = `http://127.0.0.1:8000/api/transactions/${editTransactionId}/`;
            method = 'PATCH';
        }
        const response = await fetch(
            url,
            {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transactionData)
            }
        );
        if(response.ok){
            transactionForm.reset();
            editTransactionId = null;
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
async function deleteTransaction(id){
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
// edit transaction //
function editTransaction(id,title,amount,category,type,date){
    editTransactionId = id;
    document.getElementById('title').value = title;
    document.getElementById('amount').value = amount;
    document.getElementById('category').value = category;
    document.getElementById('type').value = type;
    document.getElementById('date').value = date;
}
// logout func // 
function logout(){
    localStorage.clear();
    window.location.href = 'index.html';
}