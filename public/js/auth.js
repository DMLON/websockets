document.querySelector("#btn-login")?.addEventListener("click", async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username");
    const password = document.querySelector("#password");

    try{
        const res = await fetch('/auth/login',{
            method:"POST",
            body:JSON.stringify({
                username:username.value,
                password:password.value,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(res.redirected){
            window.location.href=res.url;
        }
        else{
            console.error("An error ocurred");
        }
    }
    catch(err){
        console.log(err);
    }
    
});

document.querySelector("#btn-signup")?.addEventListener("click", async (event) => {
    event.preventDefault();
    window.location.href="/auth/signup";
});

document.querySelector("#btn-logout")?.addEventListener("click", async (event) => {
    event.preventDefault();

    try{
        const res = await fetch('/auth/logout',{
            method:"POST",
        })
        const result = await res.json();
        if(result.error){
            console.error("An error ocurred");
            console.error(result.status);
        }
        else{
            window.location.href=result.redirectURL;
        }
    }
    catch(err){
        console.log(err);
    }
    
});