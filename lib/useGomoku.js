import { useState, useEffect } from "react";

export default function useGomoku(
  ws, pushChatMessage, handleGameStart, handleGameOver
) {
  const [board, setBoard] = useState();
  const [result, setResult] = useState();
  const [players, setPlayers] = useState();
  const [lastDrop, setLastDrop] = useState();
  const [currentIsBlack, setCurrentIsBlack] = useState();

  useEffect(() => {
    const eventListener = (event) => {
      const data = JSON.parse(event.data);

      if (data["message_type"] === "GOMOKU_GAME_INFO") {
        handleGameStart();
        setBoard(data["board"]);
        setLastDrop(data["last_drop"]);
        setPlayers(data["players"]);
        setCurrentIsBlack(data["current_is_black"])
      }
      else if (data["message_type"] === "GOMOKU_GAME_OVER") {
        setResult(data["winner"]);
        handleGameOver();
      }
      else if (data["message_type"] === "GOMOKU_BROADCAST") {
        let msg = { "is_system": true };

        if (data["type"] === "MORE_THAN_2_PEOPLE")
          msg["content"] = "五子棋只能两个人下哦";
        if (data["type"] === "PLAY_WITH_ALGORITHM")
          msg["content"] = "已为你匹配我们的五子棋机器人AlphaGomoku，祝你好运！";

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
      if (ws)
        ws.removeEventListener(
          "message",
          eventListener
        );
    };
  }, [ws, handleGameOver, handleGameStart, pushChatMessage]);

  const handleDrop = (x, y) => {
    ws.send(JSON.stringify({
      "message_type": "GOMOKU_DROP",
      "x": x,
      "y": y
    }));
  };

  return {
    board,
    result,
    players,
    lastDrop,
    currentIsBlack,
    handleDrop
  };
}