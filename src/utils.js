import { server, httpPort } from "./config";

function formatParams(params) {
    return Object.keys(params)
        .map((key) => key + "=" + encodeURIComponent(params[key]))
        .join("&");
}

function convertToJSON(response) {
    if (!response.ok) {
        throw `API request failed with response status ${response.status} and text: ${response.statusText}`;
    } else {
        return response
            .clone()
            .json()
            .catch((error) => {
                // throw an error containing the text that couldn't be converted to JSON
                return response.text();
            });
    }
}

async function get(url, params = {}, asJSON = true) {
    let fullPath = "http://" + server + ":" + httpPort + url;
    if (Object.keys(params).length !== 0) {
        fullPath += "?" + formatParams(params);
    }
    const response =
        (asJSON ? (
            fetch(fullPath, {
                method: "GET",
                credentials: "include",
                mode: "cors",
            })
                .then(convertToJSON))
            : fetch(fullPath, {
                method: "GET",
                credentials: "include",
                mode: "cors",
            }))
            .catch((error) => {
                // give a useful error message
                throw `GET request to ${url} failed with error:\n${error}`;
            });
    return response;
}

async function postStep(url, params = {}) {
    return fetch("http://" + server + ":" + httpPort + url, {
        method: "POST",
        body: JSON.stringify(params),
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        }
    })
}

async function post(url, params = {}) {
    const response = postStep(url, params)
        .then(convertToJSON)
        .catch((error) => {
            // give a useful error message
            throw `POST request to ${url} failed with error:\n${error}`;
        });
    return response;
}

function getSessdata() {
    let cookie = document.cookie;
    let pos = cookie.indexOf("sessdata=") + 9;
    let sessdata = parseInt(cookie.substring(pos));
    return sessdata;
}

function getId() {
    let cookie = document.cookie;
    let pos = cookie.indexOf("id=") + 3;
    let id = parseInt(cookie.substring(pos));
    return id;
}

function getUserName() {
    let cookie = document.cookie;
    let pos = cookie.indexOf("user_name=") + 10;
    let end = pos;
    while (end < cookie.length && cookie[end] !== ';') 
        end++;
    let name = cookie.substring(pos, end);
    return name;
}


export { get, post, getSessdata, getId, getUserName };