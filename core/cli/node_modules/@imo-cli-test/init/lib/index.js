'use strict';

module.exports = init;

function init(packageName, cmdObj) {
    console.log(packageName, cmdObj, process.env.CLI_TARGET_PATH)
}
