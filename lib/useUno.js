import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getUserName } from "./utils";

export default function useUno(ws, roomId, pushChatMessage, handleGameStart, handleGameOver) {
  const [cardPool, setCardPool] = useState([]);
  const [cardsInHand, setCardsInHand] = useState([]);
  const [gameInfo, setGameInfo] = useState(null);
  const [drawnOne, setDrawnOne] = useState(false);
  const [lastDrew, setLastDrew] = useState(0);
  const [winner, setWinner] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [suspectOptionShow, setSuspectOptionShow] = useState(false);
  const [isFirstGame, setIsFirstGame] = useState(true);

  const [hint, setHint] = useState("");
  // const [options, setOptions] = useState("");

  useEffect(() => {

  const eventListener = (event) => {
    const data = JSON.parse(event.data);

    if (data["message_type"] === "UNO_START") {
    }
    else if (data["message_type"] === "UNO_CARDS_IN_HAND") {
      setCardsInHand(data["cards"].sort((a, b) => a - b));
    }
    else if (data["message_type"] === "UNO_GAME_INFO") {
      setGameInfo(data);
      setHint(data["next_player"] === getUserName() ? "到你了" : "");
      handleGameStart();
    }
    else if (data["message_type"] === "UNO_DRAW_ONE_RES") {
      setLastDrew(data["card"]);
      setDrawnOne(true);
    }
    else if (data["message_type"] === "UNO_LAST_CARD") {
      setDrawnOne(false);
      setCardPool((prev) => [...prev, data["last_card"]]);
    }
    else if (data["message_type"] === "UNO_GAMEOVER") {
      setWinner(data["winner"]);
      setGameResult(data["result"])
      handleGameOver();
      setCardPool([]);
      setIsFirstGame(false);
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
        let obj = data["object"] === getUserName() ? '你' : data["object"];
        let sbj = data["user_name"] === getUserName() ? '你' : data["user_name"];
        let text = `${sbj}对${obj}毫不留情地使用了+4`;
        msg["content"] = text;

        if (data["object"] === getUserName()) {
          setHint(`${sbj}对你使用了+4 `);
          setSuspectOptionShow(true);
        }
      }
      else if (data["type"] === "SUSPECT") {
        let sbj = data["user_name"] === getUserName() ? '你' : data["user_name"];
        let obj = data["suspect"] === getUserName() ? '你' : data["suspect"];
        msg["content"] = data["success"] ?
          `${sbj}发现${obj}在有非黑牌可以打出的情况下仍使用了+4，${obj}被罚牌4张` :
          `${sbj}质疑${obj}在有非黑牌可以打出的情况下仍然使用+4，但事实并非如此，${obj}确已无计可施。${sbj}反被罚牌6张`;
      }
      else if (data["type"] === "LESS_THAN_3_PEOPLE")
        msg["content"] = "至少要3个人才能开始游戏，邀请好友一起来吧";
      else if(data["type"] === "MORE_THAN_10_PEOPLE")
        msg["content"] = "最多只能10个人参与游戏";

      pushChatMessage(msg);
    }
  };

    if (ws) {
      ws.addEventListener(
        "message",
        eventListener
      );
    }

    return () => {
      if (ws) ws.removeEventListener(
        "message",
        eventListener
      );
    }
  }, [ws, handleGameOver, handleGameStart, pushChatMessage]);

  const handlePlay = (card, color) => {
    ws.send(JSON.stringify({
      "message_type": "UNO_PLAY",
      "room_id": parseInt(roomId),
      "card": card,
      "specified_color": color
    }));
  }

  const handleDrawOne = () => {
    ws.send(JSON.stringify({
      "message_type": "UNO_DRAW_ONE",
      "room_id": parseInt(roomId),
    }));
  }

  const handleSkipAfterDrawingOne = () => {
    setDrawnOne(false);
    cardsInHand.unshift(lastDrew);
    cardsInHand.sort((a, b) => a - b);
    setCardsInHand(cardsInHand.slice());

    ws.send(JSON.stringify({
      "message_type": "UNO_SKIP_AFTER_DRAWING_ONE",
      "room_id": parseInt(roomId),
    }));
  }

  const handleSuspect = () => {
    ws.send(JSON.stringify({
      "message_type": "UNO_SUSPECT",
      "room_id": parseInt(roomId),
      "user_name": getUserName()
    }));
  }

  const handleDisSuspect = () => {
    ws.send(JSON.stringify({
      "message_type": "UNO_DISSUSPECT",
      "room_id": parseInt(roomId),
      "user_name": getUserName()
    }));
  }

  return {
    cardPool: cardPool,
    cardsInHand: cardsInHand,
    gameInfo: gameInfo,
    drawnOne: drawnOne,
    lastDrew: lastDrew,
    winner: winner,
    gameResult: gameResult,
    isFirstGame: isFirstGame,
    hint: hint,
    suspectOptionShow: suspectOptionShow,
    setSuspectOptionShow: setSuspectOptionShow,
    handlePlay: handlePlay,
    handleDrawOne: handleDrawOne,
    handleSkipAfterDrawingOne: handleSkipAfterDrawingOne,
    handleSuspect: handleSuspect,
    handleDisSuspect: handleDisSuspect
  };
}