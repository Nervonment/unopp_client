import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { PlusCircle } from "lucide-react";

export default function PlayerList({
  players,
  isSelf,
  gameStarted,
  roomId
}) {
  return (
    <div className="flex flex-col gap-1 h-full py-2">
      {
        players.map((val, idx) => (
          <div key={idx}
            className="w-full flex justify-between items-center px-4"
          >
            <div className="flex gap-1 items-center">
              <Avatar userId={val["id"]} userName={val["name"]} size={30} showInfoOnHover={true} />
              <span>{val["name"]}</span>
              <span className="text-muted-foreground">{isSelf(val["name"]) ? "你" : ""}</span>
            </div>
            {
              !gameStarted ? (
                val["prepared"] ?
                  <span className="text-primary">已准备</span> :
                  <span className="text-muted-foreground">未准备</span>
              ) : (
                val["offline"] ?
                  <span className="text-destructive">已掉线</span> :
                  <></>
              )
            }
          </div>
        ))
      }
      {
        gameStarted ? <></> :
          <div className="w-full text-center">
            <Button
              variant="link"
              onClick={() => {
                copy(window.location.href);
                message.success("房间链接已复制到剪贴板");
              }}
            >
              <span className="flex gap-1 items-center"><PlusCircle /> 邀请朋友</span>
            </Button>
          </div>
      }
    </div>
  )
}