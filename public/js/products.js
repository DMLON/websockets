document.querySelector("#btn-post").addEventListener("click", async (event) => {
    event.preventDefault();
    const title = document.querySelector("#title");
    const price = document.querySelector("#price");
    const thumbnail = document.querySelector("#thumbnail");
    try {
        const res = await fetch("/products", {
            method: "POST",
            body: JSON.stringify({
                title: title.value,
                price: price.value,
                thumbnail: thumbnail.value,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();
        if (result.error) {
            console.error("An error ocurred");
            console.error(result.status);
        } else {
            title.value = "";
            price.value = "";
            thumbnail.value = "";
            window.location.reload();
        }
    } catch (err) {
        console.log(err);
    }
});
