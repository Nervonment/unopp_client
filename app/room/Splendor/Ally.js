import Avatar from "antd/es/avatar/avatar";
import Image from "next/image";

export default function Ally({
  condition,    // 达成盟友条件
  reputation,   // 盟友的声望值
  bgImgIdx,     // 背景图片索引
  isOwned,
  ownerAvatarURL
}) {
  return (
    <div className="relative w-[80px] h-[90px] rounded-sm shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.6),0_4px_6px_-4px_rgb(0_0_0_/_0.6);]">
      <Image className="absolute left-0 top-0 rounded-md brightness-75" src={`/assets/splendor/ally_backgrounds/${bgImgIdx}.png`} alt={bgImgIdx} width={80} height={90}/>
      <div className="flex flex-col gap-1">
        <span className="text-[24px] absolute left-1 top-1 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.8)]">
          {reputation}
        </span>
        <div className="absolute right-1 bottom-1 flex flex-col gap-[2px]">
          {condition.map((val, idx) =>
            val ?
              <div className="relative" key={idx}>
                <Image className="drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)]" width={22} height={22} src={`/assets/splendor/mines/${idx}_ore.png`} alt={idx} />
                <span className="absolute left-[16px] top-[8px] text-xs drop-shadow-[1px_3px_0px_rgba(0,0,0,0.8)]">
                  {val}
                </span>
              </div> : <div key={idx}></div>
          )}
        </div>
        {
          isOwned ?
            <Avatar
              className="absolute left-1 bottom-1"
              size={"large"}
              src={ownerAvatarURL}
              alt={"拥有者"}
            />
            : <></>
        }
      </div>
    </div>
  )
}
