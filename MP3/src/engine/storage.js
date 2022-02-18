"use strict";

// Storage for objects and camera for levels
class Storage   {
    constructor()   {
        this.firstLevelCam = null;
        this.firstLevelStorage = [];
        this.secondLevelCam = null;
        this.secondLevelStorage = [];
        this.smallCamera = null;
    }
    addObj(level, sqSet)    {
        if (level === 1)    {
            for (let i = 0; i < sqSet.length; i++)  {
                this.firstLevelStorage[i] = (sqSet[i]);
            }
        }
        else    {
            for (let i = 0; i < sqSet.length; i++) {
                this.secondLevelStorage[i] = (sqSet[i]);
            }
        }
    }

    addCam(level, cam)    {
        if (level === 1) this.firstLevelCam = cam;
        else this.secondLevelCam = cam;
    }

    addSmallCam(cam)    {
        this.smallCamera = cam;
    }
}

let mStorage = null;

function init() {
    mStorage = new Storage();
}

function addCam(level, cam) {
    mStorage.addCam(level, cam);
}

function addObj(level, sqSet)   {
    mStorage.addObj(level, sqSet);
}

function empty(level)   {
    if (level === 1) return mStorage.firstLevelStorage.length === 0;
    if (level === 2) return mStorage.secondLevelStorage.length === 0;
}

function getCam(level)  {
    if (level === 1) return mStorage.firstLevelCam;
    if (level === 2) return mStorage.secondLevelCam;
}

function getObjs(level, num)  {
    if (level === 1) return mStorage.firstLevelStorage;
    if (level === 2) return mStorage.secondLevelStorage;
}

function addSmallCam(cam)  {
    mStorage.addSmallCam(cam);
}
    
function getSmallCam()  {
    return mStorage.smallCamera;
}

export { init, addCam, addObj, empty, getCam, getObjs, addSmallCam, getSmallCam};