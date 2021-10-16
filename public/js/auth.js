document.querySelector("#btn-login")?.addEventListener("click", async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const profilePhoto = document.querySelector("#photo");

    try{
        const res = await fetch('/auth/login',{
            method:"POST",
            body:JSON.stringify({
                username:username.value,
                email:email.value,
                profilePhoto:profilePhoto.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();
        if(result.error){
            console.error("An error ocurred");
            console.error(result.status);
        }
        else{
            window.location.href='/products'
        }
    }
    catch(err){
        console.log(err);
    }
    
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