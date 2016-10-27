'use strict';
const optimist = require('optimist');
const processed = optimist
    .usage("Usage: $0 [--stdin] <number>{2, 10}")
    .options({
        stdin: {
            describe: "Accept numbers from stdin rather from arguments",
        }
    });
const args = processed.argv;

if (args.stdin) {
    processStdin(calculate);
} else {
    process.nextTick(function() {
        calculate(args._);
    })
}


function calculate(numbers) {
    if (numbers.length < 2) {
        console.error("You should provide at least 2 numbers ");
        process.exitCode = 1;
        process.exit();
    }

    if (numbers.length > 10) {
        console.log('no more than 10 parameters should be specified');
        process.exitCode = 2;
        process.exit();
    }

    const sum = numbers.reduce(function (res, a) {
        return res + a;
    }, 0);

    console.log(sum);
}



function processStdin(cb, timeout) {
    let contents = "";
    let length = 0;

    const TIMEOUT = timeout || 1000;
    // const MAX_SIZE = 3540000;                                                                                                                                                                 

    const timeoutId = setTimeout(() => {
        console.log("Timed out");
        throw 'Timed out'                                                                                                                                                                     
    }, TIMEOUT);

    process.stdin.setEncoding("utf8");

    process.stdin.on("readable", () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            length += chunk.length;
            contents += chunk;
        }
    });

    process.stdin.on("end", () => {
        clearTimeout(timeoutId);
        const numbers = contents.split(/\s+/).map(Number);
        
        cb(numbers);    
    });
}                         