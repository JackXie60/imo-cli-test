'use strict';

module.exports = core;

const path = require("path")
const log = require("@imo-cli-test/log")
const init = require("@imo-cli-test/init")
const exec = require("@imo-cli-test/exec")
const colors = require("colors")
const semver = require("semver")
const userHome = require("user-home")
const pathExist = require("path-exists").sync
const commander = require("commander")

const pkg = require("../package.json")
const constant = require("./const")

let args;
const program = new commander.Command()

async function core() {
    try {
        await preper()
        registryCommand()
        
    } catch (e) {
        log.error(e.message)
    }
}

async function preper() {
    checkPkgVersion()
    checkNodeVersion()
    await checkRoot()
    checkUserhome()
    checkEnv()
    await checkGlobalUpdate()
}

function registryCommand() {
    const commandName = Object.keys(pkg.bin)[0]
    const packageVersion = pkg.version

    program.name(commandName)
        .usage("<command> [options]")
        .version(packageVersion)
        .option("-d, --debug", "是否开启调试模式", false)
        .option("-tp, --targetPath <targetPath>", "是否指定入口文件路径")

    program.command("init [packageName]")
        .option("-f, --force", "是否强制初始化项目")
        .action(exec)

    // 开启debug
    program.on("option:debug", () => {
        if (program.opts().debug) {
            process.env.LOG_LEVEL = "verbose"
        } else {
            process.env.LOG_LEVEL = "info"
        }

        log.level = process.env.LOG_LEVEL

    })

    // 入口文件路径
    program.on("option:targetPath", () => {
        process.env.CLI_TARGET_PATH = program.opts().targetPath
    })

    // 未知command处理
    program.on("command:*", function (obj) {
        const availableNames = program.commands.map(command => command.name())
        console.log(colors.red("当前命令不可用:", obj.join(",")))
        console.log(colors.red("当前可用命令:", availableNames.join(",")))
    })

    program.parse(process.argv)
}

async function checkGlobalUpdate() {
    const currentVersion = pkg.version
    const pkgName = pkg.name
    const {
        getNpmSemverVersion
    } = await import("@imo-cli-test/get-npm-info")
    const lastVersion = await getNpmSemverVersion(currentVersion, pkgName);

    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${pkgName}, 当前版本：${currentVersion}, 最新版本：${lastVersion}`))
    }
}

function checkEnv() {
    const dotenv = require("dotenv")
    const dotPath = path.resolve(userHome, '.env')

    if (pathExist(dotPath)) {
        dotenv.config({
            path: dotPath
        })
    }
    createDefaultConfig()
    log.verbose("环境变量", process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
    const config = {
        home: userHome
    }

    if (process.env.CLI_HOME) {
        config["cliHome"] = path.join(userHome, process.env.CLI_HOME)
    } else {
        config["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }

    process.env.CLI_HOME_PATH = config.cliHome
}

function checkUserhome() {
    if (!userHome || !pathExist(userHome)) {
        throw new Error(colors.red("当前用户主目录不存在"))
    }
}

async function checkRoot() {
    const module = await import("root-check")
    module.default()
}

function checkNodeVersion() {
    const lowestVersion = constant.LOWEST_NODE_VERSION
    const currentVersion = process.version

    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(("当前node版本过低，node版本至少需要" + lowestVersion)))
    }
}

function checkPkgVersion() {
    log.success(pkg.version)
}