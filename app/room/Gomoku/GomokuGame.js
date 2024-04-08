import Avatar from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useGomoku from "@/lib/useGomoku"
import { cn, getId } from "@/lib/utils";
import { useCallback, useState } from "react";

const Board = ({ board, handleDrop, myColorIsBlack, lastDrop }) => {
  return (
    <div className="bg-gradient-to-b from-orange-200 to-orange-300 w-[calc(min(100vh,100vw)-64px)] h-[calc(min(100vh,100vw)-64px)]">
      <div className="h-[calc(50%/15)]"></div>
      {
        board.map((row, y) => (
          <div key={y} className={cn(
            "flex h-[calc(100%/15)] l-[calc(50%/15)] w-[calc(100%/15*15.5)]",
          )}>
            <div className="w-[calc(50%/15)]"></div>
            {
              row.map((val, x) => (
                <div
                  key={x}
                  className={cn(
                    "relative w-[calc(100%/15)]",
                  )}
                >
                  <div
                    className={cn(
                      "w-full h-full absolute left-0 top-0 border-gray-900 z-10",
                      x < 14 && "border-t-[1px]",
                      y < 14 && "border-l-[1px]",
                    )}
                  >
                  </div>

                  {
                    lastDrop.x === x && lastDrop.y === y ?
                      <div className="absolute left-[-2px] top-[-2px] w-1 h-1 rounded-full bg-red-500 z-30"></div> : <></>
                  }
                  {
                    (x === 3 && y === 3) || (x === 3 && y === 11) || (x === 11 && y === 3) || (x === 11 && y === 11) ?
                      <div className="absolute left-[-2px] top-[-2px] w-[5px] h-[5px] rounded-full bg-black z-10"></div> : <></>
                  }
                  {
                    val === 'b' ? <div className="absolute w-[72%] h-[72%] left-[-36%] top-[-36%] rounded-full border-none shadow-md bg-black z-20"></div> :
                      val === 'w' ? <div className="absolute w-[72%] h-[72%] left-[-36%] top-[-36%] rounded-full border-none shadow-md bg-white z-20"></div> :
                        <button
                          className={cn(
                            "absolute w-[72%] h-[72%] left-[-36%] top-[-36%] rounded-full border-none bg-none z-20",
                            myColorIsBlack ? "hover:bg-[rgba(0,0,0,0.5)]" : "hover:bg-[rgba(255,255,255,0.5)]"
                          )}
                          onClick={() => handleDrop(x, y)}
                        >
                        </button>
                  }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}

export default function GomokuGame({
  ws, pushChatMessage, gameStarted, handleGameStart, handleGameOver
}) {
  const {
    board,
    result,
    players,
    lastDrop,
    currentIsBlack,
    handleDrop
  } = useGomoku(
    ws, pushChatMessage, handleGameStart,
    useCallback(() => {
      handleGameOver(); setIsFirstGame(false)
    }, [handleGameOver])
  );

  const [isFirstGame, setIsFirstGame] = useState(true);

  if (!isFirstGame || gameStarted)
    return (
      <div className="w-full h-full relative flex items-center justify-around">
        <Board
          board={board}
          handleDrop={handleDrop}
          myColorIsBlack={players.find(val => val["id"] === getId())["is_black"]}
          lastDrop={lastDrop}
        />
        <div className="flex flex-col items-start gap-4 p-4">
          {
            players.map((val, idx) => (
              <div key={idx} className="flex gap-2 items-center justify-center">
                <Avatar userId={val["id"]} userName={val["name"]} size={"large"} alt={val["name"]} />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">{val["name"]}</span>
                  <span>{val["is_black"] ? "黑" : "白"}</span>
                </div>
              </div>
            ))
          }
          <Separator orientation="vertical" />
          {
            gameStarted ?
              <span>
                轮到<span className="font-bold">{currentIsBlack ? "黑" : "白"}</span>子
              </span> :
              <span className="font-bold">
                {result === "BLACK" ? "黑方获胜" :
                  result === "WHITE" ? "白方获胜" :
                    "平局"}
              </span>
          }
        </div>
      </div>
    )
}