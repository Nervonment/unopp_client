import { useEffect, useState } from "react";

export default function useSplendor(
  ws, pushChatMessage, handleGameStart, handleGameOver
) {
  const [gameInfo, setGameInfo] = useState();
  const [winner, setWinner] = useState();

  useEffect(() => {
    const eventListener = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data["message_type"] === "SPLENDOR_GAME_INFO") {
        setGameInfo(data["info"]);
        handleGameStart();
      }
      else if (data["message_type"] === "SPLENDOR_GAME_OVER") {
        setGameInfo(data["info"]);
        setWinner({ id: data["winner_id"], name: data["winner_name"] });
        handleGameOver();
      }
      else if (data["message_type"] === "SPLENDOR_BROADCAST") {
        let msg = { "is_system": true };

        if (data["type"] === "LESS_THAN_2_PEOPLE")
          msg["content"] = "至少要2个人才能开始游戏，邀请好友一起来吧";
        if (data["type"] === "MORE_THAN_4_PEOPLE")
          msg["content"] = "最多只能4个人参与游戏";

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
    }
  }, [ws, handleGameStart, handleGameOver, pushChatMessage]);


  const handleTake2 = (mine) => {
    ws.send(JSON.stringify({
      "message_type": "SPLENDOR_TAKE_2",
      "mine": mine
    }));
  }

  const handleTake3 = (mines) => {
    console.log(mines);
    ws.send(JSON.stringify({
      "message_type": "SPLENDOR_TAKE_3",
      "mines": mines
    }));
  }

  const handleBuyCoupon = (idx) => {
    ws.send(JSON.stringify({
      "message_type": "SPLENDOR_BUY_COUPON",
      "coupon_idx": idx
    }));
  }

  const handleReserveCoupon = (idx) => {
    ws.send(JSON.stringify({
      "message_type": "SPLENDOR_RESERVE_COUPON",
      "coupon_idx": idx
    }));
  }

  const handleBuyReservedCoupon = (idx) => {
    ws.send(JSON.stringify({
      "message_type": "SPLENDOR_BUY_RESERVED_COUPON",
      "coupon_idx": idx
    }));
  }

  const handleReturnMine = (mine) => {
    ws.send(JSON.stringify({
      "message_type": "SPLENDOR_RETURN_MINE",
      "mine": mine
    }));
  }

  return {
    gameInfo,
    winner,
    handleTake2,
    handleTake3,
    handleBuyCoupon,
    handleReserveCoupon,
    handleBuyReservedCoupon,
    handleReturnMine
  };
}