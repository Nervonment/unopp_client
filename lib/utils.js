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

function formatParams(params) {
  return Object.keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
}

export async function get(url, params = {}, asJSON = true) {
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
  if (userId)
    return `http://${server}:${httpPort}/user-icon/${userId}.png`;
  return '';
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

export function sendFriendRequest(id, afterSuccess = () => { }) {
  post("/friend-request", {
    "requestee_id": id
  })
    .then((response) => {
      if (response === "SUCCESS") {
        message.success("已发送请求", 2);
        setTimeout(() => {
          afterSuccess();
        }, 200);
      }
      else if (response === "ALREADY_REQUESTED")
        message.warning("已经发送过请求", 2);
      else if (response === "USER_DONOT_EXIST")
        message.error("用户不存在", 2);
      else if (response === "CANNOT_REQUEST_SELF")
        message.warning("不能添加自己为好友", 2);
      else if (response === "ALREADY_FRIEND")
        message.warning("你们已经是好友", 2);
    })
    .catch((e) => console.log(e))
}

export function timestampToDateStr(timestamp, now) {
  const date = new Date(timestamp * 1000);
  let dateStr = "";

  if (date.getFullYear() !== now.getFullYear())
    dateStr += `${date.getFullYear()}/`;
  if (date.getFullYear() === now.getFullYear() && (date.getMonth() !== now.getMonth() || date.getDate() !== now.getDate()))
    dateStr += `${date.getMonth() + 1}/${date.getDate()} `;
  dateStr += `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`

  return dateStr
}