/*
 * File: xml.js
 *
 * logics for loading an xml file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";
// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

let mParser = new DOMParser();

function decodeJSON(data) {
    return data.text();
}

function parseJSON(text) {
    return JSON.parse(text);
}

function load(path) {
    return map.loadDecodeParse(path, decodeJSON, parseJSON);
}

export {has, get, load, unload}