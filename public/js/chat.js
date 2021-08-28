var socket = io.connect();

function formatDate(date){
    date_temp = new Date(date);
    hours = date_temp.getHours();
    minutes = date_temp.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const convertToMessages = (messages) => {
    return messages.map(message =>formatMessage(message)).join(' ');
}

const formatMessage = (messageInfo) =>{
    return `
    <li class=".left.clearfix">
        <span class="chat-img1 pull-left">
            <img class="img-circle" src="${messageInfo.profilePicture}" alt="User Avatar"></img>
        </span>
        <div class="chat-body1.clearfix"> 
            <p>
                <b>${messageInfo.name}</b>: ${messageInfo.message}
            </p>
            <div class="chat_time pull-right"> ${formatDate(messageInfo.date)}</div>
        </div>
    </li>
    `
}

const isUserValid = (user) =>{
    if(localUser.email == ""){
        // No puede enviar mensajes
        console.log("Please set your email to use chat")
        return false;
    }
    if(localUser.name == ""){
        // No puede enviar mensajes
        console.log("Please set your name to use chat")
        return false;
    }
    return true;
}

let localUser = {id:"",email:"",name:"",profilePhoto:""}

let userId = ""

socket.on('connect', function() {
    localUser.id = socket.id; //
});

message_container = $('#messages-container')

let connectedUsers = []

socket.on('messages', products => {
    const html = convertToMessages(products);
    document.getElementById('messages-container').innerHTML = html;
});

socket.on('users', users => {
    connectedUsers = users;
    const index = connectedUsers.map(user => user.id).indexOf(String(localUser.id));
    localUser = connectedUsers[index]

    const users_p = $('#users');
    users_p.html(connectedUsers.map(user => user.name == ""? "Unnamed": user.name).join(', '))
});


document.querySelector("#send-message-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const messageContent = document.querySelector("#message-content");
    if(!isUserValid(localUser))
        return;
    
    // Empty message
    if(messageContent.value == '')
        return;
    try{
        socket.emit('newMessage',JSON.stringify({
            message:messageContent.value,
            date:new Date()
            }));
            messageContent.value= '';
    }
    catch(err){
        console.log(error);
    }
});


// Change Name
document.querySelector("#change-name-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const data = document.querySelector("#name");

    try{
        socket.emit('changeName',data.value);
    }
    catch(err){
        console.log(error);
    }
});

// Change email
document.querySelector("#change-email-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const data = document.querySelector("#email");

    try{
        socket.emit('changeEmail',data.value);
    }
    catch(err){
        console.log(error);
    }
});

// Change photo
document.querySelector("#change-photo-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const data = document.querySelector("#profilePicture");

    try{
        socket.emit('changePicture',data.value);
    }
    catch(err){
        console.log(error);
    }
});



// socket.emit('newMessage',)

// message_container.appendChild(formatMessage(messageInfo));

