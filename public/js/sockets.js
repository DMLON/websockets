var socket = io.connect();

socket.on('connect', function() {
    const userId = socket.sessionid; //
    console.log(userId);
});

socket.on('products', products => {
    const html = convertToTable(products);
    document.getElementById('productsTable').innerHTML = html;
});

const convertToTable = products => products.map( product =>
`
    <tr>
        <td>${product.title}</td>
        <td>$${product.price}</td>
        <td><img style="width=80px" src=${product.thumbnail}></td>
    </tr>
`
).join(' ');


document.querySelector("#btn-post").addEventListener("click", async (event) => {
    event.preventDefault();
    const title = document.querySelector("#title");
    const price = document.querySelector("#price");
    const thumbnail = document.querySelector("#thumbnail");

    try{
        socket.emit('newProduct',{
            title:title.value,
            price:price.value,
            thumbnail:thumbnail.value
            });
        title.value= '';
        price.value= '';
        thumbnail.value= '';
    }
    catch(err){
        console.log(error);
    }
    
});