import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function Coupon({
  costs,        // 矿脉的价格
  reputation,   // 矿脉的声望值
  type,         // 矿脉对应的宝石种类
  level,        // 矿脉的等级
  bgImgIdx,     // 背景图片索引
  backUp,       // 是否背面朝上
  reversable = true,
  interactable = true,
  handleReserve,
  handleBuy,
}) {
  const [onHover, setOnHover] = useState(false);

  if (!backUp) {
    const onMouseOver = () => {
      setOnHover(true);
    }

    const onMouseOut = () => {
      setOnHover(false);
    }

    return (
      <div
        className={cn(
          "w-[80px] h-[120px] rounded-sm relative transition-all shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.6),0_4px_6px_-4px_rgb(0_0_0_/_0.6);] z-[5]",
          onHover && interactable && "scale-110"
        )}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {
          onHover && interactable ? (
            reversable ?
              <div className="w-[80px] h-[120px] absolute left-0 top-0 z-10">
                <button
                  className="w-[80px] h-[60px] rounded-t-sm bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] hover:text-lg transition-all"
                  onClick={() => handleReserve(bgImgIdx)}
                >
                  预订
                </button>
                <button
                  className="w-[80px] h-[60px] rounded-b-sm bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] hover:text-lg transition-all"
                  onClick={() => handleBuy(bgImgIdx)}
                >
                  购买
                </button>
              </div> :
              <button
                className="absolute left-0 top-0 z-10 w-[80px] h-[120px] rounded-sm bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] hover:text-lg transition-all"
                onClick={() => handleBuy(bgImgIdx)}
              >
                购买
              </button>
          ) :
            <></>
        }
        <Image className="absolute left-0 top-0 rounded-md z-[-10] brightness-50" src={`/assets/splendor/coupon_backgrounds/${bgImgIdx}.png`} width={80} height={120} alt="" />
        <div className="relative flex justify-between z-0 w-full rounded-t-sm px-2 bg-[rgba(255,255,255,0.15)]">
          <span className="drop-shadow-[2px_3px_0px_rgba(0,0,0,0.8)] text-[24px] h-[40px]">
            {reputation > 0 ? reputation : " "}
          </span>
        </div>
        <Image className="absolute right-1 top-1 z-0 drop-shadow-[1px_2px_0px_rgba(0,0,0,0.8)]" src={`/assets/splendor/mines/${type}_ore.png`} alt={type} width={30} height={30} />
        <div className="absolute left-1 bottom-1 flex flex-col justify-start z-0">
          {
            costs.map((val, idx) => (
              val ?
                <div key={idx} className="relative h-[18px]">
                  <Image className="drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)]" src={`/assets/splendor/mines/${idx}.png`} alt={idx} width={20} height={20} />
                  <span className="absolute left-[16px] top-[6px] text-xs drop-shadow-[1px_3px_0px_rgba(0,0,0,0.8)]">{val}</span>
                </div> : <div key={idx}></div>
            ))
          }
        </div>
      </div>
    )
  }

  else return (
    <div className={cn(
      "brightness-90 relative w-[80px] h-[120px] border-4 border-foreground flex flex-col items-center justify-center rounded-sm shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.6),0_4px_6px_-4px_rgb(0_0_0_/_0.6);]",
      level === 1 && "bg-lime-900",
      level === 2 && "bg-orange-900",
      level === 3 && "bg-sky-900"
    )}
    >
      <div className="flex flex-col text-[10px] items-center">
        <span>Splendor</span>
        <span>×</span>
        <span>Minecraft</span>
      </div>
      <span className="absolute bottom-1 text-sm">{level}</span>
    </div>
  )
}