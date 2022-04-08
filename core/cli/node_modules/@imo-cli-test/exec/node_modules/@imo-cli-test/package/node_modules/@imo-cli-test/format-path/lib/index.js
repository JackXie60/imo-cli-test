'use strict';

module.exports = formatPath;

const path = require("path")

function formatPath(p) {
    if (p && typeof p === "string") {
        const seq = path.sep;
        if(seq === "/"){
            return p
        } else{
            return p.replace(/\\/g, "/")
        }
    }
}