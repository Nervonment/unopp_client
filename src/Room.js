import { Button, Input, Modal, message } from 'antd';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { server, port } from './config';
import './Room.css';
import ChatMessage from './ChatMessage';

function Room() {
  const [nameInputOpen, setNameInputOpen] = useState(true);
  const [nameInputConfirmLoading, setNameInputConfirmLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatMessagesRef = useRef([]);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://${server}:${port}`);

    let socket = socketRef.current;
    socket.addEventListener(
      "message",
      (event) => {
        console.log("Message from server: ", event.data);
        const data = JSON.parse(event.data);

        if (data["message_type"] === "JOIN_ROOM_RES") {
          if (data["success"]) {
            setNameInputOpen(false);
          }
          else {
            alert(data["info"]);
          }
          setNameInputConfirmLoading(false);
        }
        else if (data["message_type"] === "NEW_USER_MESSAGE") {
          chatMessagesRef.current.unshift(data["message"]);
          setChatMessages(chatMessagesRef.current.slice());
        }
        else if (data["message_type"] === "SEND_MESSAGE_RES") {
          alert("已与房间断开连接，请重新加入");
        }
      }
    );

    return () => {
      socketRef.current.close();
    }
  }, []);

  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];

  const handleJoinRoom = () => {
    if (userName === null || userName === "")
      messageApi.open({
        type: "warning",
        content: "请输入你的名字"
      });
    else if (password === null || password === "")
      messageApi.open({
        type: "warning",
        content: "请输入密码"
      });
    else {
      setNameInputConfirmLoading(true);
      const roomId = searchParams.get("id");
      let socket = socketRef.current;
      console.log("The room id is " + roomId + ".");
      socket.send(JSON.stringify({
        "message_type": "JOIN_ROOM",
        "room_id": parseInt(roomId),
        "user_name": userName,
        "password": password
      }));
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  const handleUserSendMessage = () => {
    setUserMessage("");
    if (userMessage === null || userMessage === "")
      messageApi.open({
        type: "warning",
        content: "不能发送空白消息"
      });
    else {
      const roomId = searchParams.get("id");
      let socket = socketRef.current;
      socket.send(JSON.stringify({
        "message_type": "SEND_MESSAGE",
        "message": {
          "type": "plain_text",
          "room_id": parseInt(roomId),
          "user_name": userName,
          "content": userMessage
        }
      }));
    }
  }

  return (
    <div className='Room-container'>
      {contextHolder}
      <Modal
        title="加入房间"
        open={nameInputOpen}
        confirmLoading={nameInputConfirmLoading}
        onOk={handleJoinRoom}
        onCancel={() => navigate("/")}
      >
        <span>名字</span>
        <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="别人看到的你的名字" />
        <span>密码</span>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="房间密码" />
      </Modal>

      <div className="Room-bottom">
        <div className='Room-user-message-form'>
          <Input size="large" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="输入消息..." />
          <Button type="primary" size="large" onClick={handleUserSendMessage}>发送</Button>
        </div>
        {chatMessages.map((value, key) => (
          <ChatMessage
            key={key}
            userName={value["user_name"]}
            message={value["content"]}
            isSelf={value["user_name"] === userName}
          />
        ))
        }
      </div>
    </div>
  );
}

export default Room;