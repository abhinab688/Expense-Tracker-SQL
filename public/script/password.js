const paswrdBtn=document.getElementById('password-btn');

paswrdBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const email=document.getElementById('email').value;
    console.log(email,'email')
    const obj={
        email
    }
    axios.post('http://18.181.229.61:3000/forgotpassword', obj).then(res=>{
        console.log(res)
        if(res.status==201){
            notify(res.data.message)
            document.getElementById('email').value='';
        }
    }).catch(err=>{
        console.log(err,'err')
        notify(err.response.data.message)
        document.getElementById('email').value='';
    })
})

function notify(message){
    const notification=document.getElementById('notification');
    notification.innerHTML=`<h1>${message}</h1>`
    setTimeout(()=>{
        notification.remove()
    },2000)
}
