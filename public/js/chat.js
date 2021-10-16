
const formatMessage = (messageInfo) => {
    return `
    <li class=".left.clearfix">
        <span class="chat-img1 pull-left">
            <img class="img-circle" src="${messageInfo.profilePhoto}" alt="User Avatar"></img>
        </span>
        <div class="chat-body1.clearfix"> 
            <p>
                <b>${messageInfo.name}</b>: ${messageInfo.message}
            </p>
            <div class="chat_time pull-right"> ${formatDate(messageInfo.date)}</div>
        </div>
    </li>
    `;
};

document.querySelector("#send-message-btn").addEventListener("click", async (event) => {
    event.preventDefault();
    const messageContent = document.querySelector("#message-content");


    // Empty message
    if (messageContent.value == "") return;
    try {
        const res = await fetch("/chat", {
            method: "POST",
            body: JSON.stringify({
                message: messageContent.value,
                date: new Date(),
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();
        if (result.error) {
            console.error("An error ocurred");
            console.error(result.status);
            if('redirectURL' in result){
                window.location.href = result.redirectURL;
            }
        } else {
            window.location.reload();
        }
    } catch (err) {
        console.log(err);
    }
});
