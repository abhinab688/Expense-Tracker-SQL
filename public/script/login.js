function loginUser(event){
    event.preventDefault()
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    console.log(email,password)
    const obj={
        email,
        password
    }
    axios.post('http://18.181.229.61:3000/login',obj)
    .then(res => {
        if(res.status==201){
            notify(res.data.message)
            console.log(res)
            window.location.href='../html/expense.html';
            localStorage.setItem('token',res.data.token)
        }
    })
    .catch(err=>{
        console.log(err)
        if(err.response.status==401){
            document.getElementById('password').value="";
            notify(err.response.data.message)
        }
        if(err.response.status==404){
            document.getElementById('email').value="";
            document.getElementById('password').value="";
            notify(err.response.data.message)
        }        
    })

}


function notify(message){
    const notification=document.getElementById('notification');
    notification.innerHTML=`<h1>${message}</h1>`
    setTimeout(()=>{
        notification.remove()
    },2000)
}

// For Forgot Password
const password=document.getElementById('forgot-password');
password.addEventListener('click',()=>{
    window.location.href='../html/password.html';
})