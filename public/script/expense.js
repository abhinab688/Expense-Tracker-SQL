function addExpense(event){
    event.preventDefault();

    const amount=document.getElementById('amount').value;
    const description=document.getElementById('description').value;
    const category=document.getElementById('category').value;
    const token=localStorage.getItem('token');

    const expenseDetails={
        amount,
        description,
        category
    }
    console.log(expenseDetails)
    axios.post('http://18.181.229.61:3000/addExpense',expenseDetails,{headers:{'Authorization':token}} )
    .then((res)=>{
        console.log(res)
        notify(res.data.message)
    })
    .catch(err => console.log(err))
}


window.addEventListener('DOMContentLoaded',()=>{
    const rows=localStorage.getItem('rows');
    const token= localStorage.getItem('token');
    const page=1;
    axios.get(`http://18.181.229.61:3000/getExpense/?page=${page}&rows=${rows}`, {headers:{'Authorization':token}})
    .then(data=>{
        showExpenseOnScreen(data.data.data)
        showPagination(data.data)
    })
    .catch(err => {console.log(err)})
})

function notify(message){
    const notification=document.getElementById('notification');
    notification.innerHTML=`<h1>${message}</h1>`
    setTimeout(()=>{
        notification.remove()
    },2000)
}

function showExpenseOnScreen(data){
    const details=document.getElementById('details');
    details.innerHTML="";
    data.forEach(expense=>{
        const expenseHtml = `<li id=${expense.id}> ${expense.amount}------ ${expense.description}------ ${expense.category} 
                        <button onClick="deleteUser(${expense.id})">Delete</button>
           </li>`

        details.innerHTML +=expenseHtml;
        
    })
}

const pagination=document.getElementById('pagination');
function showPagination({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage
}){
    pagination.innerHTML="";

    if(hasPreviousPage){
        const btn2=document.createElement('button');
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=> getExpenses(previousPage));
        pagination.appendChild(btn2)
    }

    const btn1=document.createElement('button');
    btn1.innerHTML=currentPage;
    btn1.addEventListener('click',()=> getExpenses(currentPage));
    pagination.appendChild(btn1)

    if(hasNextPage){
        const btn3=document.createElement('button');
        btn3.innerHTML=nextPage;
        btn3.addEventListener('click',()=>getExpenses(nextPage));
        pagination.appendChild(btn3)
    }
}

function setRows(event){
    event.preventDefault()
    const rowsNumber=document.getElementById('rows-number').value;
    console.log(rowsNumber,'sasas')
    localStorage.setItem('rows',rowsNumber)
}


function getExpenses(page){
    const rows=localStorage.getItem('rows');
    const token= localStorage.getItem('token');
    axios.get(`http://18.181.229.61:3000/getExpense/?page=${page}&rows=${rows}`,{headers:{'Authorization':token}})
    .then((data)=>{
        showExpenseOnScreen(data.data.data)
        showPagination(data.data)
    }).catch(err=>{
        console.log(err)
    })
}

function deleteUser(id){
    const token=localStorage.getItem('token');
    axios.delete(`http://18.181.229.61:3000/deleteExpense/${id}`, {headers:{'Authorization':token}})
    .then((res)=>{
        console.log(res)
        if(res.status==201){
            removeUserFromScreen(id)
            notify(res.data.message);
        }
    }).catch(err =>{
        console.log(err)
        if(err.response.status==400){
            notify(err.response.data.message)
        }
    })
}
function removeUserFromScreen(id){
    const details=document.getElementById('details');
    const expense=document.getElementById(id);
    details.removeChild(expense)

}

//payment

document.getElementById('rzp-button1').onclick= async function(e){
    const token= localStorage.getItem('token');
    const response= await axios.get('http://18.181.229.61:3000/premiummembership', {headers:{'Authorization': token}})
    console.log(response)
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "7003442036"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://18.181.229.61:3000/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
         .then(() => {
             alert('You are a Premium User Now')
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response){
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
    });
}


// For leaderBoard (premium feature)
window.addEventListener('DOMContentLoaded',()=>{
    const expenseDetails=document.getElementById('expense-details');
    const token = localStorage.getItem('token');
    const premiumTag= document.getElementById('premium-tag');
    const premiumBtn=document.getElementById('rzp-button1');
    axios.get('http://18.181.229.61:3000/premiumusers',{headers:{'Authorization':token}})
    .then(res=>{
        if(res.data.ispremiumuser==false){
            expenseDetails.remove()
        }
        if(res.data.ispremiumuser==true){
            premiumTag.innerHTML=('<h2>Premium User</h2>')
            premiumBtn.remove()
            axios.get('http://18.181.229.61:3000/getusers').then(res=>{
                const users=res.data.data;
                for(var i=0; i<users.length; i++){
                leaderBoardUsers(users[i])
            }
        })
        }
        
        
    }).catch(err => {
        console.log(err)
    })
})

//to show users on leaderboard
function leaderBoardUsers(user){
    const leaderBoard=document.getElementById('leaderboard');  
    const data=`<li>${user.name} <button onClick=showDetails(${user.id})>Show Details</button> </li>`
    leaderBoard.innerHTML+=data;
}

//to show details of indivisual user
function showDetails(id){
    axios.get(`http://18.181.229.61:3000/getdetails/${id}`)
    .then(res=>{
        console.log(res,'<<<<details')   
        const datas=res.data.data;
        if(datas.length==0){
            showNull()
        }else{
            for(var i=0; i<datas.length; i++){
                showDetailsOnScreen(datas[i])
            } 
        }         
    }).catch(err => console.log(err))
}

// To show others details (premium feature)
function showDetailsOnScreen(data){
    const details=document.getElementById('other-details');
    const datas=`<li>${data.amount}-----${data.description}-----${data.category} </li>`
    details.innerHTML +=datas;
}


function showNull(){
    const details=document.getElementById('other-details');
    details.innerHTML="No Expense Added";
}