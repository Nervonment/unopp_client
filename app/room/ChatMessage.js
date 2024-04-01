'use client';

import { uploadDefaultAvatar } from "@/lib/utils";
import { Avatar } from "antd";
import Image from "next/image";

export default function ChatMessage({
  userName,
  avatarURL,
  message,
  isSelf = false,
}) {
  if (!message["is_system"])
    return (
      <div
        className={!isSelf ?
          "flex items-start gap-2" :
          "w-full flex flex-row-reverse items-start gap-2"
        }
      >
        <Avatar src={avatarURL} size={44} />

        <div className="flex flex-col">
          {
            isSelf ? <></> :
              <span className="text-muted-foreground text-sm pb-2 pl-1">{userName}</span>
          }
          {
            message["type"] === "plain_text" ?
              <div className={isSelf ?
                "border-border border-2 rounded-md px-4 py-2 break-words max-w-40 w-fit min-h-5" :
                "border-none rounded-md px-4 py-2 break-words max-w-40 w-fit min-h-5 bg-primary text-primary-foreground"
              }
              >{message["content"]}</div> :
              <Image width={80} height={80} src={`/assets/stickers/${message["sticker"]}.png`} alt="表情" />
          }
        </div>
      </div>
    );

  return (
    <span className="text-muted-foreground text-center p-1 text-sm w-full">{message["content"]}</span>
  )
}