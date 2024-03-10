import './Register.css';
import { Button, Input, message, Space } from "antd";
import { post } from "./utils";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import md5 from 'js-md5';
import { httpPort, server } from './config';

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");

  const handleRegister = () => {

    if (userName === "") {
      messageApi.open({
        type: 'warning',
        content: '请输入你的名字',
      });
      return;
    }

    if (userName.length > 40) {
      messageApi.open({
        type: 'warning',
        content: '名字太长了',
      });
      return;
    }

    if (userName.indexOf(';') !== -1) {
      messageApi.open({
        type: 'warning',
        content: '名字中不能包含\';\'',
      });
      return;
    }

    if (password === "") {
      messageApi.open({
        type: 'warning',
        content: '请输入你的密码',
      });
      return;
    }

    if (password.length < 6) {
      messageApi.open({
        type: 'warning',
        content: '密码长度最少6个字符',
      });
      return;
    }

    if (password !== password1) {
      messageApi.open({
        type: 'warning',
        content: '两次输入密码不一致',
      });
      return;
    }


    post("/register", {
      "user_name": userName,
      "password": md5(password)
    })
      .then((response) => {
        if (response === "SUCCESS") {
          messageApi.open({
            type: 'success',
            content: '注册成功',
          });
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
        else if (response === "USERNAME_DUPLICATE") {
          messageApi.open({
            type: 'error',
            content: '名字重复',
          });
        }
        else if (response === "FAILED") {
          messageApi.open({
            type: 'error',
            content: '注册失败',
          });
        }
      })
      .catch((e) => { console.log(e) });
  };

  return (
    <div className="Register">
      {contextHolder}
      <Logo />
      <Space.Compact>
        <Button size='large'>名字</Button>
        <Input
          value={userName} size='large' placeholder='输入你的名字'
          onChange={(e) => setUserName(e.target.value)}
        />
      </Space.Compact>
      <Space.Compact>
        <Button size='large'>密码</Button>
        <Input.Password
          value={password} size='large' placeholder='输入你的密码'
          onChange={(e) => setPassword(e.target.value)}
        />
      </Space.Compact>
      <Space.Compact>
        <Button size='large'>确认密码</Button>
        <Input.Password
          value={password1} size='large' placeholder='请再输入一次密码'
          onChange={(e) => setPassword1(e.target.value)}
        />
      </Space.Compact>
      <Button type='primary' size='large' onClick={handleRegister}>注册</Button>
    </div>
  )
}

export default Register;