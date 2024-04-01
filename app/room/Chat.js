'use client';

import { ScrollArea } from "@/components/ui/scroll-area"
import ChatMessage from "./ChatMessage"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { useState } from "react"
import { getAvatarURL } from "@/lib/utils";

const stickersIdx = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "10", "11", "12", "13", "14", "15", "16", "17", "18",
  "19", "20", "21", "22", "23", "24"
];

export default function Chat({
  chatMessages,
  isSelf,
  handleSendMessage
}) {
  const [stickerOpen, setStickerOpen] = useState(false);

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "" && message !== null)
      handleSendMessage({
        "type": "plain_text",
        "content": message,
      });
    setMessage("");
  }

  return (
    <div className="h-full w-full relative">
      <ScrollArea className="w-full h-[calc(100%-60px)]">
        <div className="p-3 flex flex-col-reverse items-start gap-2">
          {
            chatMessages.map((val, idx) => (
              <ChatMessage
                key={idx}
                message={val}
                userName={val["user_name"]}
                isSelf={isSelf(val["user_name"])}
                avatarURL={getAvatarURL(val["user_id"])}
              />
            ))
          }
        </div>
      </ScrollArea>
      <Separator />
      <input className="w-0 h-0" autoComplete="off" />
      <input type="password" className="w-0 h-0" autoComplete="off" />
      <div className="absolute bottom-0 flex justify-around w-full gap-2 p-2">
        <Input
          className=" max-w-[calc(100%-100px)]"
          value={message}
          placeholder="输入消息..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.keyCode === 13) sendMessage(); }}
        />
        <Popover
          open={stickerOpen}
          onOpenChange={setStickerOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <ScrollArea className="h-60 w-full">
              <div className="grid grid-cols-4">
                {
                  stickersIdx.map((val, idx) => (
                    <div
                      key={idx}
                      className="relative h-20"
                    >
                      <button
                        className="absolute border-none bg-none w-20 h-20"
                        onClick={() => {
                          setStickerOpen(false);
                          handleSendMessage({
                            "type": "stiker",
                            "sticker": val
                          });
                        }}
                      ></button>
                      <Image width={80} height={80} src={`/assets/stickers/${val}.png`} alt={`表情${val}`} />
                    </div>
                  ))
                }
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Button
          size="icon"
          onClick={sendMessage}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div >
  )
}