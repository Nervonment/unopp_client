import { Button, Input, Modal, Popover, message } from 'antd';
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { server, wsPort } from './config';
import './Room.css';
import ChatMessage from './ChatMessage';
import UnoGame from './UnoGame';
import PlayerStatus from './PlayerStatus';
import UnoGameResult from './UnoGameResult';
import Logo from './Logo';
import Instruction from './Instruction';
import { get, getSessdata, getUserName } from './utils';

// 硬编码所有的表情
const stickersIdx = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "10", "11", "12", "13", "14", "15", "16", "17", "18",
  "19", "20", "21", "22", "23", "24"
];

function Room() {
  const [nameInputOpen, setNameInputOpen] = useState(true);
  const [nameInputConfirmLoading, setNameInputConfirmLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const userNameRef = useRef("");
  const [password, setPassword] = useState("");

  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatMessagesRef = useRef([]);

  const [stickerPopOpen, setStickerPopOpen] = useState(false);

  const [cardPool, setCardPool] = useState([]);
  const cardPoolRef = useRef([]);

  const [roomMembers, setRoomMembers] = useState([]);
  const [prepared, setPrepared] = useState(false);
  const [cardsInHand, setCardsInHand] = useState([]);
  const [drawnOne, setDrawnOne] = useState(false);
  const [lastDrew, setLastDrew] = useState(0);
  const [gameInfo, setGameInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const [hint, setHint] = useState("");
  const [options, setOptions] = useState("");

  const [avatarsURL, setAvatarsURL] = useState({});
  const avatarsURLRef = useRef({});

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
        const data = JSON.parse(event.data);

        if (data["message_type"] === "AUTHORIZE_RES") {
          if (data["success"]) {
            setUserName(data["user_name"]);
            userNameRef.current = data["user_name"];
          }
          else {
            messageApi.open({
              type: 'warning',
              content: '请登录',
            });
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
        }
        else if (data["message_type"] === "ERROR") {
          alert(data["info"]);
          setNameInputConfirmLoading(false);
        }
        else if (data["message_type"] === "JOIN_ROOM_RES") {
          if (data["success"]) {
            setNameInputOpen(false);
          }
          else {
            alert(data["info"]);
          }
          setNameInputConfirmLoading(false);
        }
        else if (data["message_type"] === "CHAT_MESSAGE") {
          chatMessagesRef.current.unshift(data["message"]);
          setChatMessages(chatMessagesRef.current.slice());
        }
        else if (data["message_type"] === "SEND_MESSAGE_RES") {
          alert("已与房间断开连接，请重新加入");
        }
        else if (data["message_type"] === "PLEASE_LOG_IN") {
          messageApi.open({
            type: 'warning',
            content: '请登录',
          });
        }

        else if (data["message_type"] === "ROOM_MEMBERS_INFO") {
          setRoomMembers(data["members"]);

          // 加载新加入用户的头像
          for (let member of data["members"])
            if (!(member["name"] in avatarsURLRef.current)) {
              get("/icon", { "user_name": member["name"] }, false)
                .then((response) => {
                  response.blob().then(
                    (blob) => {
                      let reader = new FileReader();
                      reader.addEventListener('load', () => {
                        avatarsURLRef.current[member["name"]] = reader.result;
                        console.log(avatarsURLRef.current);
                        setAvatarsURL(Object.assign({}, avatarsURLRef.current));
                      });
                      reader.readAsDataURL(blob);
                    }
                  );
                })
                .catch((e) => console.log(e));
            }
        }

        else if (data["message_type"] === "UNO_START") {
        }
        else if (data["message_type"] === "UNO_CARDS_IN_HAND") {
          setCardsInHand(data["cards"].sort((a, b) => a - b));
        }
        else if (data["message_type"] === "UNO_GAME_INFO") {
          setGameInfo(data);
          setHint(data["next_player"] === getUserName() ? "到你了" : "");
          setGameStarted(true);
        }
        else if (data["message_type"] === "UNO_DRAW_ONE_RES") {
          setLastDrew(data["card"]);
          setDrawnOne(true);
        }
        else if (data["message_type"] === "UNO_LAST_CARD") {
          cardPoolRef.current.push(data["last_card"]);
          setDrawnOne(false);
          setCardPool(cardPoolRef.current.slice());
        }
        else if (data["message_type"] === "UNO_GAMEOVER") {
          setWinner(data["winner"]);
          setGameResult(data["result"])
          setGameStarted(false);
          setPrepared(false);
          cardPoolRef.current = [];
          setCardPool([]);
        }
        else if (data["message_type"] === "UNO_BROADCAST") {
          let msg = { "is_system": true };

          if (data["type"] === "DIDNT_SAY_UNO")
            msg["content"] = `${data["user_name"]}出倒数第2张牌前未说UNO，被罚牌2张`;
          else if (data["type"] === "SAY_UNO")
            msg["content"] = `${data["user_name"]}即将打出倒数第2张牌`;
          else if (data["type"] === "MISSAY_UNO")
            msg["content"] = `${data["user_name"]}乱说UNO，被罚牌2张`;
          else if (data["type"] === "SAID_UNO_BUT_DIDNT_PLAY")
            msg["content"] = `${data["user_name"]}说了UNO却又不出牌，被罚牌2张`
          else if (data["type"] === "WILD_DRAW_4") {
            let obj = data["object"] === userNameRef.current ? '你' : data["object"];
            let sbj = data["user_name"] === userNameRef.current ? '你' : data["user_name"];
            let text = `${sbj}对${obj}毫不留情地使用了+4`;
            msg["content"] = text;

            if (data["object"] === userNameRef.current) {
              setHint(`${sbj}对你使用了+4 `);
              setOptions(
                <div>
                  <Button
                    size='large'
                    onClick={() => {
                      const roomId = searchParams.get("id");
                      socket.send(JSON.stringify({
                        "message_type": "UNO_SUSPECT",
                        "room_id": parseInt(roomId),
                        "user_name": userNameRef.current,
                      }));
                      setOptions("");
                    }}
                  >质疑</Button>
                  <Button
                    size='large'
                    onClick={() => {
                      const roomId = searchParams.get("id");
                      socket.send(JSON.stringify({
                        "message_type": "UNO_DISSUSPECT",
                        "room_id": parseInt(roomId),
                        "user_name": userNameRef.current,
                      }));
                      setOptions("");
                    }}
                  >忍痛接受</Button>
                </div>
              );
            }
          }
          else if (data["type"] === "SUSPECT") {
            let sbj = data["user_name"] === userNameRef.current ? '你' : data["user_name"];
            let obj = data["suspect"] === userNameRef.current ? '你' : data["suspect"];
            msg["content"] = data["success"] ?
              `${sbj}发现${obj}在有非黑牌可以打出的情况下仍使用了+4，${obj}被罚牌4张` :
              `${sbj}质疑${obj}在有非黑牌可以打出的情况下仍然使用+4，但事实并非如此，${obj}确已无计可施。${sbj}反被罚牌6张`;
          }
          else if (data["type"] === "LESS_THAN_3_PEOPLE")
            msg["content"] = "至少要3个人才能开始游戏，邀请好友一起来吧";

          chatMessagesRef.current.unshift(msg);
          setChatMessages(chatMessagesRef.current.slice());
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
    if (password === null || password === "")
      messageApi.open({
        type: "warning",
        content: "请输入密码"
      });
    else {
      setNameInputConfirmLoading(true);
      const roomId = searchParams.get("id");
      let socket = socketRef.current;
      socket.send(JSON.stringify({
        "message_type": "JOIN_ROOM",
        "room_id": parseInt(roomId),
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
        "message_type": "CHAT_MESSAGE",
        "room_id": parseInt(roomId),
        "message": {
          "type": "plain_text",
          "content": userMessage
        }
      }));

      if (userMessage.toLowerCase() === "uno")
        socket.send(JSON.stringify({
          "message_type": "UNO_SAY_UNO",
          "room_id": parseInt(roomId),
        }));
    }
  };

  const handleUserSendSticker = (stickerIdx) => {
    const roomId = searchParams.get("id");
    let socket = socketRef.current;
    socket.send(JSON.stringify({
      "message_type": "CHAT_MESSAGE",
      "room_id": parseInt(roomId),
      "message": {
        "type": "sticker",
        "sticker": stickerIdx
      }
    }));
  };

  const handlePrepare = (prepared) => {
    setPrepared(prepared);

    let socket = socketRef.current;
    const roomId = searchParams.get("id");

    socket.send(JSON.stringify({
      "message_type": "GAME_PREPARE",
      "room_id": parseInt(roomId),
      "prepare": prepared
    }));
  };

  const handlePlay = (card, color) => {
    let socket = socketRef.current;
    const roomId = searchParams.get("id");

    socket.send(JSON.stringify({
      "message_type": "UNO_PLAY",
      "room_id": parseInt(roomId),
      "card": card,
      "specified_color": color
    }));
  }

  const handleDrawOne = () => {
    let socket = socketRef.current;
    const roomId = searchParams.get("id");

    socket.send(JSON.stringify({
      "message_type": "UNO_DRAW_ONE",
      "room_id": parseInt(roomId),
    }));
  }

  const handleSkipAfterDrawingOne = () => {
    let socket = socketRef.current;
    const roomId = searchParams.get("id");

    setDrawnOne(false);
    cardsInHand.unshift(lastDrew);
    cardsInHand.sort((a, b) => a - b);
    setCardsInHand(cardsInHand.slice());

    socket.send(JSON.stringify({
      "message_type": "UNO_SKIP_AFTER_DRAWING_ONE",
      "room_id": parseInt(roomId),
    }));
  }

  return (
    <div className='Room'>
      {contextHolder}
      <Modal
        title="加入房间"
        cancelText="取消"
        okText="确认"
        open={nameInputOpen}
        confirmLoading={nameInputConfirmLoading}
        onOk={handleJoinRoom}
        onCancel={() => navigate("/")}
      >
        <span>密码</span>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="房间密码" />
      </Modal>


      <div className='Room-leftbar'>
        <div className='Room-logo-container'>
          <Logo />
        </div>

        <div className='Room-playerlistlabel-container'>
          <div className='label'>玩家列表</div>
          {
            gameStarted ?
              <>
              </> :
              <div>
                <Button onClick={() => { handlePrepare(!prepared); }}>
                  {prepared ? "取消" : "准备"}
                </Button>
              </div>
          }
        </div>


        <div className='Room-playerinfo-container'>
          {
            roomMembers.map((value, key) => (
              <PlayerStatus
                key={key}
                gameStarted={gameStarted}
                name={value["name"]}
                isSelf={value["name"] === userName}
                prepared={value["prepared"]}
                offline={value["offline"]}
                cardCount={value["card_count"]}
              >
              </PlayerStatus>
            ))}
        </div>



        <div className="Room-chat-container">
          <div className='Room-user-message-form'>
            <Input size='large' value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onPressEnter={handleUserSendMessage}
              placeholder="输入消息..." />

            <Popover content={
              <div className='Room-chat-stickers-container'>
                <div className='Room-chat-stickers'>
                  {
                    stickersIdx.map((value, key) => (
                      <div className='Room-char-stickers-sticker' key={key}>
                        <button className='Room-char-stickers-button'
                          onClick={() => { handleUserSendSticker(value); setStickerPopOpen(false); }}
                        />
                        <img width={80} height={80} src={`assets/stickers/${value}.png`} alt={`表情${value}`} />
                      </div>
                    ))
                  }
                </div>
              </div>
            }
              title="表情"
              open={stickerPopOpen}
              onOpenChange={(v) => setStickerPopOpen(v)}
            >
              <Button size='large'>
                <svg t="1709468713553" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4286" width="24" height="24"><path d="M512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z m0 832C299.936 896 128 724.064 128 512S299.936 128 512 128s384 171.936 384 384-171.936 384-384 384z" p-id="4287" fill="#ffffff"></path><path d="M320 384m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="4288" fill="#ffffff"></path><path d="M704 384m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="4289" fill="#ffffff"></path><path d="M224 512c0 159.072 128.928 288 288 288s288-128.928 288-288H224z" p-id="4290" fill="#ffffff"></path></svg>
              </Button>
            </Popover>

            <Button size='large' type='primary' onClick={handleUserSendMessage}>
              <svg t="1709391356273" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4384" width="24" height="24"><path d="M865.28 202.5472c-17.1008-15.2576-41.0624-19.6608-62.5664-11.5712L177.7664 427.1104c-23.2448 8.8064-38.5024 29.696-39.6288 54.5792-1.1264 24.8832 11.9808 47.104 34.4064 58.0608l97.5872 47.7184c4.5056 2.2528 8.0896 6.0416 9.9328 10.6496l65.4336 161.1776c7.7824 19.1488 24.4736 32.9728 44.7488 37.0688 20.2752 4.096 41.0624-2.1504 55.6032-16.7936l36.352-36.352c6.4512-6.4512 16.5888-7.8848 24.576-3.3792l156.5696 88.8832c9.4208 5.3248 19.8656 8.0896 30.3104 8.0896 8.192 0 16.4864-1.6384 24.2688-5.0176 17.8176-7.68 30.72-22.8352 35.4304-41.6768l130.7648-527.1552c5.5296-22.016-1.7408-45.2608-18.8416-60.416z m-20.8896 50.7904L713.5232 780.4928c-1.536 6.2464-5.8368 11.3664-11.776 13.9264s-12.5952 2.1504-18.2272-1.024L526.9504 704.512c-9.4208-5.3248-19.8656-7.9872-30.208-7.9872-15.9744 0-31.744 6.144-43.52 17.92l-36.352 36.352c-3.8912 3.8912-8.9088 5.9392-14.2336 6.0416l55.6032-152.1664c0.512-1.3312 1.2288-2.56 2.2528-3.6864l240.3328-246.1696c8.2944-8.4992-2.048-21.9136-12.3904-16.0768L301.6704 559.8208c-4.096-3.584-8.704-6.656-13.6192-9.1136L190.464 502.9888c-11.264-5.5296-11.5712-16.1792-11.4688-19.3536 0.1024-3.1744 1.536-13.824 13.2096-18.2272L817.152 229.2736c10.4448-3.9936 18.0224 1.3312 20.8896 3.8912 2.8672 2.4576 9.0112 9.3184 6.3488 20.1728z" p-id="4385" fill="#ffffff"></path></svg>
            </Button>
          </div>
          <div className="Room-chat">
            {chatMessages.map((value, key) => (
              "is_system" in value ?
                <ChatMessage
                  key={key}
                  message={value["content"]}
                  isSystem={true}
                /> :
                <ChatMessage
                  key={key}
                  userName={value["user_name"]}
                  avatarURL={value["user_name"] in avatarsURL ? avatarsURL[value["user_name"]] :
                    'https://img-bsy.txrpic.com/preview/Element/00/00/88/59/E-885999-15265F377.png?imageMogr2/quality/90/thumbnail/320x%3E'}
                  message={value["content"]}
                  isSelf={value["user_name"] === userName}
                  isSticker={value["type"] === "sticker"}
                  stickerIdx={value["sticker"]}
                  isSystem={false}
                />
            ))
            }
          </div>
          <div className='label Room-chat-label'>聊天</div>
        </div>
      </div>

      <div className='Room-game-container'>
        {
          gameStarted ?
            <UnoGame
              cardPool={cardPool}
              cardsInHand={cardsInHand}
              gameInfo={gameInfo}
              players={gameInfo["players"]}
              avatarsURL={avatarsURL}
              started={gameStarted}
              drawnOne={drawnOne}
              lastDrew={lastDrew}
              handlePlay={handlePlay}
              handleDrawOne={handleDrawOne}
              handleSkipAfterDrawingOne={handleSkipAfterDrawingOne}
              hint={hint}
              options={options}
            />
            : <UnoGameResult winner={winner} result={gameResult} avatarsURL={avatarsURL} />
        }
      </div>

      <div className='Room-instruction'>
        <Instruction />
      </div>
    </div>
  );
}

export default Room;