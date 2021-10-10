var socket = io.connect();


document.querySelector("#btn-login")?.addEventListener("click", async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username");

    try{
        socket.emit('login',{
            username:username.value
        });
        window.location.href='/products'
    }
    catch(err){
        console.log(error);
    }
    
});

document.querySelector("#btn-logout")?.addEventListener("click", async (event) => {
    event.preventDefault();

    try{
        socket.emit('logout',{});
        window.location.href='/products'
    }
    catch(err){
        console.log(error);
    }
    
});