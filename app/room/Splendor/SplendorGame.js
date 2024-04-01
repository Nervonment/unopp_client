import useSplendor from "@/lib/useSplendor";
import Coupon from "./Coupon";
import Image from "next/image";
import Ally from "./Ally";
import { Avatar } from "antd";
import { cn, getAvatarURL, getId } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Cross, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import localFont from "next/font/local";
import { ScrollArea } from "@/components/ui/scroll-area";

const minecraft = localFont({
  src: 'minecraft.ttf',
  display: 'swap'
});

export default function SplendorGame({
  ws, pushChatMessage, gameStarted, handleGameStart, handleGameOver
}) {
  const {
    gameInfo,
    winner,
    handleTake2,
    handleTake3,
    handleBuyCoupon,
    handleReserveCoupon,
    handleBuyReservedCoupon,
    handleReturnMine
  } = useSplendor(ws, pushChatMessage, handleGameStart,
    useCallback(() => {
      handleGameOver(); setIsFirstGame(false)
    }, [handleGameOver])
  );

  const [isTaking3, setIsTaking3] = useState(false);
  const [isTaking2, setIsTaking2] = useState(false);
  const [minesChecked, setMinesChecked] = useState([false, false, false, false, false]);
  const [isFirstGame, setIsFirstGame] = useState(true);

  const isMyTurn = gameStarted ? gameInfo["player_info"]["status"] === "ACTION" : false;

  useEffect(() => {
    if (!isMyTurn) {
      setIsTaking2(false);
      setIsTaking3(false);
      setMinesChecked([false, false, false, false, false]);
    }
  }, [isMyTurn]);

  const CouponRow = ({
    coupons, level
  }) => {
    return (
      <div className="flex gap-1">
        {
          coupons.findIndex((val) => val["type"] === "EMPTY") === -1 ?
            <Coupon level={level} backUp={true} /> :
            <div
              className="w-[80px] h-[120px] border-dashed border-2 border-border rounded-md"
            ></div>
        }
        <div className="w-2"></div>
        {
          coupons.map((val, idx) => (
            val["type"] !== "EMPTY" ?
              <div key={idx}>
                <Coupon
                  costs={val["costs"]}
                  reputation={val["reputation"]}
                  type={val["type"]}
                  level={val["level"]}
                  bgImgIdx={val["idx"]}
                  backUp={false}
                  handleBuy={handleBuyCoupon}
                  handleReserve={handleReserveCoupon}
                />
              </div> :
              <div
                key={idx}
                className="w-[80px] h-[120px] border-dashed border-2 border-border rounded-md"
              ></div>
          ))
        }
      </div>
    )
  }

  if (gameStarted)
    return (
      <div className={cn("h-full w-full bg-splendor bg-cover relative", minecraft.className)}>
        <div className="h-[calc(100%-144px)] w-full flex justify-center items-center gap-8">
          <div className="flex flex-col gap-2 bg-[rgba(0,0,0,0.5)] p-4 rounded-md">
            {
              gameInfo["players"].map((val, idx) => val["id"] !== getId() && (
                <div key={idx} className="flex gap-2">
                  <div className="w-[64px] flex flex-col gap-1 items-center">
                    <Avatar
                      className={cn(
                        val["status"] !== "WAITING" && "border-4 border-primary"
                      )}
                      src={getAvatarURL(val["id"])}
                      size={56 + (val["status"] !== "WAITING" ? 8 : 0)}
                    />
                    <span className="text-lg">{val["reputation"]}</span>
                  </div>
                  <div>
                    <span>
                      <span className={val["status"] !== "WAITING" && "text-primary font-bold"}>{val["name"]}</span>
                      &nbsp;
                    </span>
                    <div className="flex">
                      {
                        val["mine_count"].map((val, idx) => (
                          <div key={idx} className="relative w-[32px] h-[30px]">
                            <Image
                              className={val === 0 && "brightness-50"}
                              src={`/assets/splendor/mines/${idx}.png`}
                              alt={idx} width={28} height={28}
                            />
                            <span
                              className={cn(
                                "absolute left-[20px] top-[12px] text-sm",
                                val === 0 && "text-muted-foreground"
                              )}
                            >
                              {val}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                    <div className="flex">
                      {
                        val["coupon_count"].map((val, idx) => (
                          <div key={idx} className="relative w-[32px] h-[30px]">
                            <Image
                              className={val === 0 && "brightness-50"}
                              src={`/assets/splendor/mines/${idx}_ore.png`}
                              alt={idx} width={28} height={28}
                            />
                            <span className={cn(
                              "absolute left-[20px] top-[12px] text-sm",
                              val === 0 && "text-muted-foreground"
                            )}
                            >
                              {val}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="bg-[rgba(0,0,0,0.5)] p-4 rounded-md">
            <div className="flex gap-2 mb-2 justify-center">
              {
                gameInfo["allies"].map((val, idx) => (
                  <Ally
                    key={idx}
                    condition={val["condition"]}
                    reputation={val["reputation"]}
                    bgImgIdx={val["idx"]}
                    isOwned={val["is_owned"]}
                    ownerAvatarURL={val["is_owned"] ? getAvatarURL(val["owner_id"]) : null}
                  />
                ))
              }
            </div>
            <div className="flex flex-col gap-1">
              <CouponRow level={3} coupons={gameInfo["coupon_lv3"]} />
              <CouponRow level={2} coupons={gameInfo["coupon_lv2"]} />
              <CouponRow level={1} coupons={gameInfo["coupon_lv1"]} />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-[120px] items-center bg-[rgba(0,0,0,0.5)] p-4 rounded-md">
            <span>银行</span>
            {
              gameInfo["bank"].map((val, idx) => (
                <div className={cn("relative h-[56px] w-[64px]", isTaking3 && "left-[-12px]")} key={idx}>

                  <button
                    className="absolute bg-none border-none left-[4px] top-[4px] w-[56px] h-[56px]"
                    onClick={() => {
                      if (isTaking2)
                        handleTake2(idx);
                      else if (isTaking3) {
                        if ((minesChecked[idx] || minesChecked.filter(x => x).length !== 3) && val > 0 && idx !== 5) {
                          minesChecked[idx] = !minesChecked[idx];
                          setMinesChecked(minesChecked.slice());
                        }
                      }
                    }}
                  >
                    <Image
                      src={`/assets/splendor/mines/${idx}.png`}
                      alt={idx} width={56} height={56}
                      className={cn(
                        "transition-all",
                        val === 0 && "brightness-50 ",
                        isTaking2 && idx !== 5 && (
                          val > 3 ?
                            "hover:scale-110 hover:brightness-125 cursor-pointer" :
                            "brightness-50  hover:sepia cursor-pointer"
                        ),
                        isTaking3 && idx !== 5 && (
                          (minesChecked.filter(x => x).length === 3 &&
                            !minesChecked[idx]) || val === 0 ?
                            "brightness-50  hover:sepia cursor-pointer" :
                            "hover:scale-110 hover:brightness-125 cursor-pointer"
                        )
                      )}
                    />
                  </button>
                  <span className={cn(
                    "absolute left-[48px] top-[36px] text-lg",
                    val === 0 && "brightness-50 ",
                    isTaking2 && idx !== 5 && val < 4 && "text-muted-foreground",
                    isTaking3 && idx !== 5 && (
                      ((minesChecked.filter(x => x).length === 3 &&
                        !minesChecked[idx]) || val === 0) &&
                      "text-muted-foreground")
                  )}>{val}</span>
                  {
                    isTaking3 && idx < 5 ?
                      <Checkbox
                        className="absolute left-[72px] top-[20px] w-[20px] h-[20px] transition-all"
                        checked={minesChecked[idx]}
                        onCheckedChange={(checked) => {
                          minesChecked[idx] = checked;
                          setMinesChecked(minesChecked.slice());
                        }}
                        disabled={(
                          minesChecked.filter(x => x).length === 3 &&
                          !minesChecked[idx]
                        ) || val === 0
                        }
                      />
                      : <></>
                  }
                </div>
              ))
            }
            <div className="w-20 flex items-center justify-center gap-1">
              {
                isTaking2 || isTaking3 ?
                  <Button variant="outline" size="icon" onClick={() => {
                    setIsTaking2(false);
                    setIsTaking3(false);
                  }}>
                    <X />
                  </Button> : <></>
              }
              {
                isTaking2 ? <></> : isTaking3 ?
                  <Button
                    variant={
                      minesChecked.filter(x => x).length === 3 ? "default" : "outline"
                    }
                    size={"icon"}
                    onClick={() => {
                      handleTake3(minesChecked.map((val, idx) => val ? idx : -1).filter(x => x != -1));
                    }}
                  >
                    <Check />
                  </Button> :
                  <>
                    <Button variant="outline" onClick={() => setIsTaking2(true)}>2</Button>
                    <Button variant="outline" onClick={() => setIsTaking3(true)}>3</Button>
                  </>
              }
            </div>
          </div>


        </div>

        <div className="h-8 w-full text-center">
          {
            gameInfo["player_info"]["status"] === "ACTION" ? "到你了" :
              gameInfo["player_info"]["status"] === "NEED_RETURN_MINE" ? "你手中的宝石数量超过了10，请归还至不超过10" :
                ""}
        </div>

        <div className="absolute left-0 bottom-0 flex items-center gap-1 bg-[rgba(0,0,0,0.5)] p-4 rounded-tr-md">
          <span className="mr-4">已预订</span>
          {
            gameInfo["player_info"]["reserved_coupons"].map((val, idx) => (
              <Coupon
                key={idx}
                costs={val["costs"]}
                reputation={val["reputation"]}
                type={val["type"]}
                level={val["level"]}
                bgImgIdx={val["idx"]}
                backUp={false}
                handleBuy={handleBuyReservedCoupon}
                reversable={false}
              />
            ))
          }
          {
            Array.from({ length: 3 - gameInfo["player_info"]["reserved_coupons"].length }, () => 0)
              .map((val, idx) => (
                <div
                  key={idx}
                  className="w-[80px] h-[120px] border-dashed border-2 border-border rounded-md"
                ></div>
              ))
          }
        </div>

        <div className="absolute bottom-0 w-full">
          <div className="m-auto flex items-center gap-2 bg-[rgba(0,0,0,0.5)] p-4 rounded-t-md w-min h-[112px]">
            <Avatar src={getAvatarURL(getId())} size={48} />
            <span className="text-[32px] px-2">{gameInfo["player_info"]["reputation"]}</span>
            <Separator orientation="vertical" />
            <div>
              <div className="flex">
                {
                  gameInfo["player_info"]["mine_count"].map((val, idx) => (
                    <div key={idx} className="w-[48px] h-[48px] relative">
                      <button
                        className={cn(
                          "w-[48px] h-[48px] absolute left-0 top-0 bg-none border-none",
                          gameInfo["player_info"]["status"] === "NEED_RETURN_MINE" ? "cursor-pointer" : "cursor-default"
                        )}
                        onClick={() => {
                          if (gameInfo["player_info"]["status"] === "NEED_RETURN_MINE")
                            handleReturnMine(idx);
                        }}
                      >
                        <Image
                          className={cn(
                            "transition-all",
                            val === 0 && "brightness-50",
                            gameInfo["player_info"]["status"] === "NEED_RETURN_MINE" && val > 0 &&
                            "brightness-125 hover:scale-110 hover:brightness-150"
                          )}
                          src={`/assets/splendor/mines/${idx}.png`}
                          alt={idx} height={48} width={48}
                        />
                      </button>
                      <span className={cn(
                        "absolute left-[36px] top-[24px]",
                        val === 0 && "text-muted-foreground",
                      )}>
                        {val}
                      </span>
                    </div>
                  ))
                }
              </div>
              <div className="flex">
                {
                  gameInfo["player_info"]["coupon_count"].map((val, idx) => (
                    <div key={idx} className="w-[48px] h-[48px] relative">
                      <Image
                        className={val === 0 && "brightness-50"}
                        src={`/assets/splendor/mines/${idx}_ore.png`}
                        alt={idx} height={48} width={48}
                      />
                      <span className={cn("absolute left-[36px] top-[24px]", val === 0 && "text-muted-foreground")}>{val}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>


      </div>
    );

  else if (!isFirstGame) return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Avatar src={getAvatarURL(winner.id)} size={72} />
      <h4>{winner.name}</h4>
      <span className='flex items-center gap-2 text-muted-foreground border-b-2 border-b-border mb-2 pb-2'>获得了胜利</span>
      <h6 className='text-center'>声望</h6>
      <ScrollArea className='max-h-[60%]'>
        <div className='flex flex-col items-start gap-2'>
          {
            gameInfo["players"].map((val, idx) => (
              <div key={idx} className='flex items-center gap-2'>
                <Avatar src={getAvatarURL(val["id"])} size={'large'} />
                <div>
                  <span>{val["name"]}</span>
                  <div className='flex h-12'>
                    {val["reputation"]}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </ScrollArea>
    </div>
  )
}