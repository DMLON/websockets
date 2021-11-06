// use minimist to load the port number from command line
const argv = require('minimist')(process.argv.slice(2));
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (argv.mode == "CLUSTER"){
    // server in cluster mode
    if (cluster.isMaster){
        console.log("Process is master")
        for(let i = 0; i < numCPUs; i++){
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    }
    else{
        require("./server");
    }
}
else if (argv.mode == "FORK" || argv.mode == undefined){
    // server in fork mode
    const child_process = require("child_process");
    const worker = child_process.fork("./src/server.js", [`--port=${argv.port || 8080}`]);
    worker.on("exit", (code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}
    

