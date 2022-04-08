'use strict';

module.exports = exec;

const Package = require("@imo-cli-test/package")
const log = require("@imo-cli-test/log")
const path = require("path")

const SETTING = {
    init: "@imo-cli-test/init"
}

const CACHE_DIR = "dependencies"

function exec() {
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    let storeDir
    let pkg;

    log.verbose("targetPath", targetPath)
    log.verbose("homePath", homePath)

    const cmdObj = arguments[arguments.length - 1]
    const cmdName = cmdObj.name()
    const packageName = SETTING[cmdName]
    const packageVersion = "latest"

    if (!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR)
        storeDir = path.resolve(targetPath, "node_modules")

        log.verbose("targetPath", targetPath)
        log.verbose("homePath", homePath)

        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
            storeDir
        })

        if(pkg.exists()) {
            // 更新
        } else {
            // 安装
            pkg.install()
        }


    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
        })
    }
    const rootFile = pkg.getRootFile()
    require(rootFile).apply(null,arguments)
}