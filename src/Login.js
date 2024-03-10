import './Login.css'
import { Button, Input, message, Space } from "antd";
import { post } from "./utils";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import md5 from 'js-md5';

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (userName === "") {
      messageApi.open({
        type: 'warning',
        content: '请输入你的名字',
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
      

    post("/login", {
      "user_name": userName,
      "password": md5(password)
    })
      .then((response) => {
        if (response === "SUCCESS") {
          messageApi.open({
            type: 'success',
            content: '登录成功',
          });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
        else if (response === "PASSWORD_INCORRECT") {
          messageApi.open({
            type: 'error',
            content: '密码不正确',
          });
        }
        else if (response === "USER_DONOT_EXIST") {
          messageApi.open({
            type: 'error',
            content: '用户不存在',
          });
        }
      })
      .catch((e) => { console.log(e) });
  };

  return (
    <div className="Login">
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
          onChange={(e)=>setPassword(e.target.value)}
        />
      </Space.Compact>
      <Button type='primary' size='large' onClick={handleLogin}>登录</Button>
      <div className='Login-hint'>没有账号？<a href='/register'>注册</a></div>
    </div>
  )
}

export default Login;