'use strict';

const { isObject } = require("@imo-cli-test/utils")
const formatPath = require("@imo-cli-test/format-path")
const { createDefaultRegistry } = require("@imo-cli-test/get-npm-info")
const pkgDir = require("pkg-dir").sync
const npminstall = require("npminstall")
const path = require("path")

class Package {
    constructor(options){
        if(!options){
            throw new Error("package option can not be empty")
        }
        if(!isObject(options)){
            throw new Error("package option must be an object")
        }
        // package的目标路径
        this.targetPath = options.targetPath
        // 缓存package的路径
        this.storeDir = options.storeDir
        this.packageName = options.packageName
        this.packageVersion = options.packageVersion
        this.getRootFile()
    }

    exists() {
        
    }

    install () {
        npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: createDefaultRegistry(),
            pkgs: [{
                name: this.packageName,
                version: this.packageVersion
            }]
        })
    }

    getRootFile() {
        if(this.targetPath) {
            const dir = pkgDir(this.targetPath)
            const packageInfo = require(path.resolve(dir, "package.json"))
            
            if(packageInfo && packageInfo.main) {
                return formatPath(path.resolve(dir, packageInfo.main))
            }
        }

        return null
    }
}

module.exports = Package;

