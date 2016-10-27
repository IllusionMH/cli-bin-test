'use strict';
const assert = require('chai').assert
const cp = require('child_process');
const path = require('path');
const os = require('os');

describe('Test for simplest CLI app', function () {
    describe('Data from arguments', function () {

        it('should exit with code 1 if no numbers provided', function (done) {
            execCli([], function (err, stdout, stderr) {
                assert.isNotNull(err, 'error should be passed to callback');
                assert.strictEqual(err.code, 1, 'error code should be 1');
                done();
            });
        });

        it('should exit with code 1 if only one number provided ', function (done) {
            execCli(['1'], function (err, stdout, stderr) {
                assert.isNotNull(err, 'error should be passed to callback');
                assert.strictEqual(err.code, 1, 'error code should be 1');
                done();
            });
        });

        it('should exit with code 2 if more than 10 arguments provided', function (done) {
            execCli(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], function (err, stdout, stderr) {
                assert.isNotNull(err, 'error should be passed to callback');
                assert.strictEqual(err.code, 2, 'error code should be 2');
                done();
            });
        });

        it('should return sum of the numbers', function (done) {
            execCli(['1', '2', '3'], function (err, stdout, stderr) {
                assert.isNull(err, 'no error should be passed to callback');
                assert.strictEqual(stdout, '6', 'sum of 1 2 3 should be 6');
                done();
            });
        });
    });

    describe('Data from stdin', function () {

        it('should exit with code 1 if empty string is provided into stdin', function (done) {
            const child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert.isNotNull(err, 'error should be passed to callback');
                assert.strictEqual(err.code, 1, 'error code should be 1');
                done();
            });

            child.stdin.end('');
        });

        it('should exit with code 1 if only one number provided ', function (done) {
            const child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert.isNotNull(err, 'error should be passed to callback');
                assert.strictEqual(err.code, 1, 'error code should be 1');
                done();
            });

            child.stdin.end('1');
        });

        it('should exit with code 2 if more than 10 arguments provided', function (done) {
            const child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert.isNotNull(err, 'error should be passed to callback');
                assert.strictEqual(err.code, 2, 'error code should be 2');
                done();
            });

            child.stdin.end('1 2 3 4 5 6 7 8 9 10 11');
        });

        it('should return sum of the numbers', function (done) {
            const child = execCli(['--stdin'], function (err, stdout, stderr) {
                assert.isNull(err, 'no error should be passed to callback');
                assert.strictEqual(stdout, '6', 'sum of 1 2 3 should be 6');
                done();
            });

            child.stdin.end('1 2 3');
        });
    });
});

function execCli(args, options, cb) {
    let filePath = path.resolve(__dirname, '..', 'npm-like-bin', 'cli');


    // Specify extension for Windows executable to avoid ENOENT errors 
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

function isFunction(fn) {
    return ({}).toString.call(fn) === '[object Function]';
}