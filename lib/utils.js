import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { httpPort, server, url } from "./config";
import { message } from "antd";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
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

async function postStep(url, params = {}) {
  return fetch(`http://${server}:${httpPort}${url}`, {
    method: "POST",
    body: JSON.stringify(params),
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    }
  })
}

export async function post(url, params = {}) {
  const response = postStep(url, params)
    .then(convertToJSON)
    .catch((error) => {
      throw `POST request to ${url} failed with error:\n${error}`;
    });
  return response;
}

export function getSessdata() {
  if (typeof window !== "undefined") {
    let cookie = document.cookie;
    let pos = cookie.indexOf("sessdata=") + 9;
    let sessdata = parseInt(cookie.substring(pos));
    return sessdata;
  }
}

export function getId() {
  if (typeof window !== "undefined") {
    let cookie = document.cookie;
    let pos = cookie.indexOf("id=") + 3;
    let id = parseInt(cookie.substring(pos));
    return id;
  }
}

// 我们假设一般人不会手动在浏览器里更改Cookie
export function getUserName() {
  if (typeof window !== "undefined") {
    let cookie = document.cookie;
    let pos = cookie.indexOf("user_name=") + 10;
    let end = pos;
    while (end < cookie.length && cookie[end] !== ';')
      end++;
    let name = cookie.substring(pos, end);
    return name;
  }
}

export function getAvatarURL(userId) {
  return `http://${server}:${httpPort}/user-icon/${userId}.png`;
}

export function uploadDefaultAvatar() {
  // 上传默认头像
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  canvas.width = 128;
  canvas.height = 128;
  context.font = '48px sans-serif';
  context.fillStyle = "#1f2020";
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(getUserName().substring(0, 2), 64, 80);

  canvas.toBlob(
    (blob) => {
      const data = new FormData();
      data.append('file', blob);
      fetch("http://" + server + ":" + httpPort + "/upload-icon", {
        method: "POST",
        body: data,
        credentials: "include",
        mode: "cors",
      })
        .then((response) => {
          response.text().then(
            (text) => {
              if (text !== "SUCCESS")
                message.error("创建默认头像失败");
            }
          )
        })
        .catch((e) => { console.log(e); });
    }
  );
}