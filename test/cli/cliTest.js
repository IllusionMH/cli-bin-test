var assert = require('assert');
var cp = require('child_process');
var path = require('path');
var os = require('os');

function execCli(args, options, cb) {

    var filePath = path.resolve('bin', 'cli');
    if (os.platform() === 'win32') {
        filePath += '.cmd';
    }
    if (isFunction(options)) {
        cb = options;
    }

    return cp.execFile(filePath, args, function (error, stdout, stderr) {
        cb(error, stdout.trim(), stderr.trim());
    });
}

describe('Test for simplest CLI app', function () {
    describe('arguments', function () {
        
        it('should exit with code 1 if no numbers provided', function (done) {
            execCli([], function (err, stdout, stderr) {
                assert(err != null);
                assert(err.code === 1);
                done();
            });
        });
        
        it('should exit with code 1 if only one number provided ', function (done) {
            execCli(['1'], function (err, stdout, stderr) {
                assert(err != null);
                assert(err.code === 1);
                done();
            });
        });
        
        it('should exit with code 2 if more than 10 arguments provided', function (done) {
            execCli(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], function (err, stdout, stderr) {
                assert(err != null);
                assert(err.code === 2);
                done();
            });
        });
        
        it('should return sum of the numbers', function (done) {
            execCli(['1', '2', '3'], function (err, stdout, stderr) {
                assert(err == null);
                assert(stdout === '6');
                done();
            });
        });
    });

    describe('stdin', function () {
        
        it('should exit with code 1 if empty string is provided into stdin', function (done) {
            var child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert(err != null);
                assert(err.code === 1);
                done();
            });

            child.stdin.end('');
        });
        
        it('should exit with code 1 if only one number provided ', function (done) {
            var child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert(err != null);
                assert(err.code === 1);
                done();
            });

            child.stdin.end('1');
        });
        
        it('should exit with code 2 if more than 10 arguments provided', function (done) {
            var child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert(err != null);
                assert(err.code === 2);
                done();
            });

            child.stdin.end('1 2 3 4 5 6 7 8 9 10 11');
        });

        it('should return sum of the numbers', function (done) {
            var child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert(err == null);
                assert(stdout === '6');
                done();
            });

            child.stdin.end('1 2 3');
        });
    });
});


function isFunction(fn) {
    return ({}).toString.call(fn) === '[object Function]';
}