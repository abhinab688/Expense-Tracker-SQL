function uploadTobackend(event){
    event.preventDefault()
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const obj={
        name,
        email,
        password
    }
    // console.log(obj,'obj')
    axios.post('http://18.181.229.61:3000/signup',obj)
    .then(response=>{
        console.log(response)
        notify(response.data.message)
    })
    .catch(err=>{
        console.log(err,'err')
        if(err.response.request.status===400){
            // console.log(err.response.request.status,'sts')
            notify(err.response.data.err)
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