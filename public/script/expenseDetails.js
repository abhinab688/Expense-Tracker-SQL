const token= localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',()=>{
    axios.get('http://18.181.229.61:3000/getallexpenses',{headers:{'Authorization':token}})
    .then(data=>{
        // console.log(data.data.data)
        const datas=data.data.data;
        console.log(data)
        for(var i=0; i<datas.length; i++){
            showExpenseOnScreen(datas[i])         
        }
    })
    .catch(err => {console.log(err)})
})

function showExpenseOnScreen(data){
    const details=document.getElementById('details');
    const datas=`<li id=${data.id}> ${data.amount}------ ${data.description}------ ${data.category} </li>`
    details.innerHTML += datas;
}

const downloadBtn=document.getElementById('download');
downloadBtn.addEventListener('click',()=>{
    axios.get('http://18.181.229.61:3000/download',{headers:{'Authorization':token}})
    .then(res=>{
        console.log(res,'<<<<<<res')
        if(res.status==200){
            var a=document.createElement('a');
            a.href=res.data.fileURL;
            a.download='Expense.csv';
            a.click()
            notify(res.data.message)
        }else{
            throw new Error(res.data.message)
            
        }

    }).catch(err=>{
        console.log(err)
    })
})

function notify(message){
    const notification=document.getElementById('notification');
    notification.innerHTML=`<h1>${message}</h1>`
    setTimeout(()=>{
        notification.remove()
    },2000)
}

window.addEventListener('DOMContentLoaded',()=>{
    axios.get('http://18.181.229.61:3000/downloadhistory',{headers:{'Authorization':token}})
    .then(res=>{
        console.log(res)
        const datas=res.data.data;
        for(var i=0; i<datas.length; i++){
            showDownloadedHistoryOnScreen(datas[i])
        }
    }).catch(err=>{
        console.log(err)
    })
})

function showDownloadedHistoryOnScreen(data){
    const downloadHistory=document.getElementById('download-history');
    const downloads=`<li>${data.url}---------${data.date}</li>`
    downloadHistory.innerHTML+=downloads;

}
