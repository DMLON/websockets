
let repeatedList = {};
const generateRandomHistogram = (cantNumbers) => {
    const repeatedList = {};
    // get the amount of times a number is repeated from 0 to "cant" and save it in a dictionary and the number must be random from range 0 to 1000
    for (let i = 0; i < cantNumbers; i++) {
        let num = Math.floor(Math.random() * 1000) + 1;
        if (repeatedList[num]) repeatedList[num]++;
        else repeatedList[num] = 1;
    }
    return repeatedList;
};

process.on("message",(message)=>{
    repeatedList = generateRandomHistogram(message);
    process.send(repeatedList);
});

process.send("ready");