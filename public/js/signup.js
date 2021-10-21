document.querySelector("#btn-signup")?.addEventListener("click", async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username");
    const password = document.querySelector("#password");
    const email = document.querySelector("#email");
    const profilePhoto = document.querySelector("#photo");
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");

    try{
        const res = await fetch('/auth/signup',{
            method:"POST",
            body:JSON.stringify({
                username:username.value,
                password:password.value,
                email: email.value,
                profilePhoto: profilePhoto.value,
                firstName: firstName.value,
                lastName: lastName.value,
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