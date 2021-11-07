# Websockets - Chat and Product List

This repository contains the source code for an app that uses socket.io as a chat app and a dynamic list that multiple users can access and manipulate

- /chat has the chat app

- /products has the product list

Live demo on Glitch website

https://chat-app-products.glitch.me/chat

To generate the tables run the following command from root folder:

`node src\database\generateTables.js`


## Running the server

As a default the server is hosted on port 8080, can be changed with the command line using double dashes as seen below

Start the server in dev mode (Nodemon) with:

`npm run start:dev -- --port xxxx`

Or the server normally on node with:

`npm run start -- --port xxxx`

## Stress testing

Test the server by going to:

`http://localhost:8080/api/randoms?cant=500000000`

Then using the website as normal

## Starting the server

### Forever

`forever -w start src/init.js`

### PM2

`pm2 start src/init.js --name="Server1" --watch -- --port 8081`

`pm2 start src/init.js --name="Server1" --watch -i max -- --port 8081`