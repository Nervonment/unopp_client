import { Button, Input, InputNumber, Modal, Space, message } from 'antd';
import './Start.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpPort, server, themeColor, wsPort } from './config';
import Logo from './Logo';
import { get, getId, getSessdata, getUserName } from './utils';
import { LoadingOutlined } from '@ant-design/icons';


function Start() {
  const [roomId, setRoomId] = useState(null);
  const roomIdRef = useRef(null);
  const [password, setPassword] = useState("");

  const [joinRoomId, setJoinRoomId] = useState(null);

  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://${server}:${wsPort}`);
    let socket = socketRef.current;

    socket.addEventListener(
      "open",
      (event) => {
        socket.send(JSON.stringify({
          "message_type": "AUTHORIZE",
          "sessdata": getSessdata()
        }));
      }
    );

    socket.addEventListener(
      "message",
      (event) => {
        //console.log("Message from server: ", event.data);
        const data = JSON.parse(event.data);

        if (data["message_type"] === "AUTHORIZE_RES") {
          if (!data["success"]) {
            messageApi.open({
              type: 'warning',
              content: '请登录',
            });
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
        }
        else if (data["message_type"] === "CREATE_ROOM_RES") {
          if (data["success"]) {
            //console.log(`Welcome to room ${parseInt(roomIdRef.current)}.`);
            navigate(`/room?id=${parseInt(roomIdRef.current)}`);
          }
          else {
            alert(data["info"]);
            setCreateRoomConfirmLoading(false);
          }
        }
        else if (data["message_type"] === "PLEASE_LOG_IN") {
          messageApi.open({
            type: 'warning',
            content: '请登录',
          })
        }
      }
    )

    return () => {
      socketRef.current.close();
    }
  }, [navigate]);

  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [createRoomConfirmLoading, setCreateRoomConfirmLoading] = useState(false);

  const handleCreateRoom = () => {
    if (roomId === null || roomId === "")
      messageApi.open({
        type: "warning",
        content: "请输入房间号"
      });
    else if (password === null || password === "")
      messageApi.open({
        type: "warning",
        content: "请设置房间密码"
      });
    else {
      setCreateRoomConfirmLoading(true);
      socketRef.current.send(JSON.stringify({
        "message_type": "CREATE_ROOM",
        "room_id": parseInt(roomId),
        "have_password": true,
        "password": password,
      }));
    }
  };


  const handleJoinRoom = () => {
    if (joinRoomId === null || joinRoomId === "")
      messageApi.open({
        type: "warning",
        content: "请输入房间号"
      });
    else
      navigate(`/room?id=${parseInt(joinRoomId)}`);
  }

  const [avatarURL, setAvatarURL] = useState("");

  const getAvatar = () => {
    get("/icon", { "id": getId() }, false)
      .then((response) => {
        response.blob().then(
          (blob) => {
            let reader = new FileReader();
            reader.addEventListener('load', () => setAvatarURL(reader.result));
            reader.readAsDataURL(blob);
          }
        );
      })
      .catch((e) => { console.log(e); });
  }

  useEffect(() => {
    getAvatar();
  }, []);

  const uploadDefaultAvatar = () => {
    // 上传默认头像
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    context.font = '48px sans-serif';
    context.fillStyle = "white";
    context.fillRect(0, 0, 128, 128);
    context.fillStyle = themeColor;
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
                  messageApi.open({
                    type: 'error',
                    content: '创建默认头像失败',
                  });
                getAvatar();
              }
            )
          })
          .catch((e) => { console.log(e); });
      }
    );
  }

  return (
    <div className="Start">
      <div className='Start-avatar'>
        <span>{getUserName()}</span>

        {
          avatarURL ?
            <img
              src={avatarURL}
              width={"48px"}
              height={"48px"}
              alt='user settings'
              style={{ borderRadius: "24px" }}
              onError={uploadDefaultAvatar}
            /> :
            <LoadingOutlined />
        }
        <button className='Start-avatar-button' onClick={() => navigate("/me")}></button>
      </div>

      <div className='Start-form-container'>

        <Logo />

        {contextHolder}
        <Button size='large' type='primary' onClick={() => setCreateRoomOpen(true)}>创建房间</Button>
        <Modal
          cancelText="取消"
          okText="确认"
          title="创建房间"
          open={createRoomOpen}
          confirmLoading={createRoomConfirmLoading}
          onOk={handleCreateRoom}
          onCancel={() => setCreateRoomOpen(false)}
        >
          <span>房间号</span>
          <div style={{ width: "100%" }}>
            <InputNumber
              controls={false} style={{ width: "100%" }}
              min={0} max={999999}
              onChange={(v) => { setRoomId(v); roomIdRef.current = v; }}
              placeholder="1到6位数字" />
          </div>
          <span>密码</span>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="设置房间密码" />
        </Modal>

        <Space.Compact>
          <InputNumber controls={false} style={{ width: "100%" }} min={0} max={999999} onChange={(v) => setJoinRoomId(v)} placeholder='房间号' />
          <Button size='large' onClick={handleJoinRoom}>加入房间</Button>
        </Space.Compact>

      </div>

      <div className='Start-author'>
        <span>Made by <a href='https://space.bilibili.com/401603096' target='_blank' rel='noreferrer'>Nervonment</a></span>
      </div>
    </div>
  );
}

export default Start;
