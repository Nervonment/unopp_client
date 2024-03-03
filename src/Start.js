import { Button, Input, InputNumber, Modal, Space, message } from 'antd';
import './Start.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { server, port } from './config';
import Logo from './Logo';


function Start() {
  const [roomId, setRoomId] = useState(null);
  const roomIdRef = useRef(null);
  const [password, setPassword] = useState("");

  const [joinRoomId, setJoinRoomId] = useState(null);

  const navigate = useNavigate();

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://${server}:${port}`);
    let socket = socketRef.current;

    socket.addEventListener(
      "open",
      (event) => {
        socket.send("Hello, Server!");
        //console.log("Connected to server.")
      }
    );

    socket.addEventListener(
      "message",
      (event) => {
        //console.log("Message from server: ", event.data);
        const data = JSON.parse(event.data);

        if (data["message_type"] === "CREATE_ROOM_RES") {
          if (data["success"]) {
            //console.log(`Welcome to room ${parseInt(roomIdRef.current)}.`);
            navigate(`/room?id=${parseInt(roomIdRef.current)}`);
          }
          else {
            alert(data["info"]);
            setCreateRoomConfirmLoading(false);
          }
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

  const [messageApi, contextHolder] = message.useMessage();

  const handleJoinRoom = () => {
    if (joinRoomId === null || joinRoomId === "")
      messageApi.open({
        type: "warning",
        content: "请输入房间号"
      });
    else
      navigate(`/room?id=${parseInt(joinRoomId)}`);
  }


  return (
    <div className="Start">
      <div className='Start-form-container'>
        <Logo />

        {/* <Input id='Start-name-input' size="large" variant="filled" placeholder="你的名字" /> */}
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
        <span>Made by <a  href='https://space.bilibili.com/401603096' target='_blank' rel='noreferrer'>Nervonment</a></span>
      </div>
    </div>
  );
}

export default Start;
