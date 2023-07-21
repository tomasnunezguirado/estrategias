const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    const response = await fetch('/api/sessions/resetpassword', {
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    });
    const result = await response.json();
    if (result.status === 1) {
        alert(result.msg);
        window.location.replace('/login');
    } else {
        alert(result.msg);
    }
})