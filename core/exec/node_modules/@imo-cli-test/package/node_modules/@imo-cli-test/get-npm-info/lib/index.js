'use strict';

module.exports = {
    getNpmInfo,
    getNpmVersion,
    getNpmSemverVersion,
    createDefaultRegistry,
}

const semver = require("semver")
const axios = require("axios")
const urlJoin = require("url-join")

function getNpmInfo(npmName, registry) {
    if(!npmName) {
        return
    }

    const regitryUrl = registry ? registry : createDefaultRegistry()
    const npmInfoUrl = urlJoin(regitryUrl, npmName)
    return axios.get(npmInfoUrl).then(info=>{
        if(info.status === 200) {
            return info.data
        }
        return null
    }).catch(err=>{
        Promise.reject(err)
    })
}

async function getNpmVersion(npmName, registry) {
    const data = await getNpmInfo(npmName, registry)
    return Object.keys(data.versions)
}

function getSemverVersion(baseVersion, versions){
    return versions
        .filter((version=>semver.gte(version, baseVersion) ))
        .sort((a, b)=>{
            semver.gt(a, b)
        })
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersion(npmName, registry)
    const semverVersions = getSemverVersion(baseVersion, versions)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

    if(semverVersions && semverVersions.length > 0) {
        return semverVersions[semverVersions.length-1]
    }
}

function createDefaultRegistry (isOrigin=false) {
    return isOrigin ? "http://registry.npmjs.org" : "http://registry.npm.taobao.org"
}