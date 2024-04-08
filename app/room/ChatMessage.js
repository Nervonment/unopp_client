'use client';

import Avatar from "@/components/ui/avatar";
import { cn, timestampToDateStr } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import Image from "next/image";

export default function ChatMessage({
  userName,
  userId,
  message,
  isSelf = false,
}) {
  const dateStr = "timestamp" in message ?
    timestampToDateStr(message["timestamp"], new Date()) : "";

  if (!message["is_system"])
    return (
      <div
        className={!isSelf ?
          "w-full flex items-start gap-2" :
          "w-full flex flex-row-reverse items-start gap-2"
        }
      >
        <Avatar userId={userId} userName={userName} size={44} />

        <div className="flex flex-col max-w-[60%]">
          {
            isSelf ? <></> :
              <span className="text-muted-foreground text-sm pb-2 pl-1 w-fit">{userName}</span>
          }
          {
            message["type"] === "plain_text" ?
              <div className={isSelf ?
                "border-none rounded-md px-4 py-2 break-words max-w-full w-fit min-h-5 bg-primary text-primary-foreground" :
                "border-border border-2 rounded-md px-4 py-2 break-words max-w-full w-fit min-h-5"
              }
              >{message["content"]}</div> :
              <Image
                width={80} height={80}
                src={`/assets/stickers/${message["sticker"]}.png`} alt="表情"
                className={isSelf ? "ml-auto" : ""}
              />
          }
        </div>

        <div
          className={cn(
            "self-stretch flex items-end text-transparent hover:text-muted-foreground transition-all cursor-default",
            isSelf ? "justify-end" : "justify-start"
          )}
        >
          {dateStr}
        </div>
      </div>
    );

  return (
    <div className="text-muted-foreground text-center p-1 text-sm w-full">{message["content"]}</div>
  )
}