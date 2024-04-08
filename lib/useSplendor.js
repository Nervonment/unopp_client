import Ally from "@/app/room/Splendor/Ally";
import Coupon from "@/app/room/Splendor/Coupon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function useSplendor(
  ws, pushChatMessage, handleGameStart, handleGameOver
) {
  const [gameInfo, setGameInfo] = useState();
  const [winner, setWinner] = useState();

  useEffect(() => {
    const eventListener = (event) => {
      const data = JSON.parse(event.data);

      if (data["message_type"] === "SPLENDOR_GAME_INFO") {
        setGameInfo(data["info"]);

        let lastAction = data["info"]["last_action"];
        if (lastAction) {
          let msg = { "is_system": true };

          if (lastAction["type"] === "TAKE_3")
            msg["content"] = (
              <div className="flex items-center justify-center">
                {`${lastAction["subject_name"]}从银行拿取了`}
                {
                  lastAction["mines"].map((val, idx) => (
                    <Image key={idx} src={`/assets/splendor/mines/${val}.png`} alt={val} width={20} height={24} />
                  ))
                }
              </div>
            );

          else if (lastAction["type"] === "TAKE_2")
            msg["content"] = (
              <div className="flex items-center justify-center">
                {`${lastAction["subject_name"]}从银行拿取了`}
                <Image src={`/assets/splendor/mines/${lastAction["mine"]}.png`} alt={lastAction["mine"]} width={20} height={24} />
                <Image src={`/assets/splendor/mines/${lastAction["mine"]}.png`} alt={lastAction["mine"]} width={20} height={24} />
              </div>
            );

          else if (lastAction["type"] === "RESERVE_COUPON")
            msg["content"] = (
              <TooltipProvider>
                <Tooltip>
                  {`${lastAction["subject_name"]}预订了`}
                  <TooltipTrigger>
                    <span className="underline cursor-pointer">一个矿脉</span>
                  </TooltipTrigger>
                  <TooltipContent className="w-[96px] p-0">
                    <Coupon
                      costs={lastAction["coupon"]["costs"]}
                      reputation={lastAction["coupon"]["reputation"]}
                      type={lastAction["coupon"]["type"]}
                      level={lastAction["coupon"]["level"]}
                      bgImgIdx={lastAction["coupon"]["idx"]}
                      backUp={false}
                      interactable={false}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );

          else if (lastAction["type"] === "BUY_COUPON" || lastAction["type"] === "BUY_RESERVED_COUPON")
            msg["content"] = (
              <TooltipProvider>
                <Tooltip>
                  {`${lastAction["subject_name"]}买下了`}
                  <TooltipTrigger>
                    <span className="underline cursor-pointer">
                      一个{lastAction["type"] === "BUY_RESERVED_COUPON" ? "预订的" : ""}矿脉
                    </span>
                  </TooltipTrigger>
                  {
                    lastAction["coupon"]["reputation"] > 0 ?
                      <span>
                        ，获得了{lastAction["coupon"]["reputation"]}点声望
                      </span> : <></>
                  }
                  <TooltipContent className="w-[96px] p-0">
                    <Coupon
                      costs={lastAction["coupon"]["costs"]}
                      reputation={lastAction["coupon"]["reputation"]}
                      type={lastAction["coupon"]["type"]}
                      level={lastAction["coupon"]["level"]}
                      bgImgIdx={lastAction["coupon"]["idx"]}
                      backUp={false}
                      interactable={false}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );

          pushChatMessage(msg);
        }

        let allyActions = data["info"]["ally_actions"];
        for (let action of allyActions) {
          pushChatMessage({
            "is_system": true,
            "content": (
              <TooltipProvider>
                <Tooltip>
                  {`${action["subject_name"]}达成了`}
                  <TooltipTrigger>
                    <span className="underline cursor-pointer">盟友条件</span>
                  </TooltipTrigger>
                  ，获得了3点声望
                  <TooltipContent className="p-0">
                    <Ally
                      condition={action["ally"]["condition"]}
                      reputation={action["ally"]["reputation"]}
                      bgImgIdx={action["ally"]["idx"]}
                      isOwned={false}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          });
        }

        handleGameStart();
      }
      else if (data["message_type"] === "SPLENDOR_GAME_OVER") {
        setGameInfo(data["info"]);
        setWinner({ id: data["winner_id"], name: data["winner_name"] });
        pushChatMessage({
          "is_system": true,
          "content": `${data["winner_name"]}获得了胜利`
        });
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