'use client';

import { ScrollArea } from "@/components/ui/scroll-area"
import ChatMessage from "./ChatMessage"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { useRef, useState } from "react"
import { getAvatarURL, timestampToDateStr } from "@/lib/utils";

const stickersIdx = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "10", "11", "12", "13", "14", "15", "16", "17", "18",
  "19", "20", "21", "22", "23", "24"
];

export default function Chat({
  chatMessages,
  isSelf,
  handleSendMessage,
  handleScrollToTop = () => { },
}) {
  const [stickerOpen, setStickerOpen] = useState(false);

  const [message, setMessage] = useState("");
  const atTopRef = useRef();

  const sendMessage = () => {
    if (message !== "" && message !== null)
      handleSendMessage({
        "type": "plain_text",
        "content": message,
      });
    setMessage("");
  }

  const now = new Date();

  return (
    <div className="h-full w-full relative flex flex-col-reverse" >

      <input className="w-0 h-0" autoComplete="off" />
      <input type="password" className="w-0 h-0" autoComplete="off" />
      <div className="flex justify-around w-full gap-2 p-2">
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
          <svg t="1709391356273" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4384" width="24" height="24"><path d="M865.28 202.5472c-17.1008-15.2576-41.0624-19.6608-62.5664-11.5712L177.7664 427.1104c-23.2448 8.8064-38.5024 29.696-39.6288 54.5792-1.1264 24.8832 11.9808 47.104 34.4064 58.0608l97.5872 47.7184c4.5056 2.2528 8.0896 6.0416 9.9328 10.6496l65.4336 161.1776c7.7824 19.1488 24.4736 32.9728 44.7488 37.0688 20.2752 4.096 41.0624-2.1504 55.6032-16.7936l36.352-36.352c6.4512-6.4512 16.5888-7.8848 24.576-3.3792l156.5696 88.8832c9.4208 5.3248 19.8656 8.0896 30.3104 8.0896 8.192 0 16.4864-1.6384 24.2688-5.0176 17.8176-7.68 30.72-22.8352 35.4304-41.6768l130.7648-527.1552c5.5296-22.016-1.7408-45.2608-18.8416-60.416z m-20.8896 50.7904L713.5232 780.4928c-1.536 6.2464-5.8368 11.3664-11.776 13.9264s-12.5952 2.1504-18.2272-1.024L526.9504 704.512c-9.4208-5.3248-19.8656-7.9872-30.208-7.9872-15.9744 0-31.744 6.144-43.52 17.92l-36.352 36.352c-3.8912 3.8912-8.9088 5.9392-14.2336 6.0416l55.6032-152.1664c0.512-1.3312 1.2288-2.56 2.2528-3.6864l240.3328-246.1696c8.2944-8.4992-2.048-21.9136-12.3904-16.0768L301.6704 559.8208c-4.096-3.584-8.704-6.656-13.6192-9.1136L190.464 502.9888c-11.264-5.5296-11.5712-16.1792-11.4688-19.3536 0.1024-3.1744 1.536-13.824 13.2096-18.2272L817.152 229.2736c10.4448-3.9936 18.0224 1.3312 20.8896 3.8912 2.8672 2.4576 9.0112 9.3184 6.3488 20.1728z" p-id="4385" fill="#ffffff"></path></svg>
        </Button>
      </div>

      <Separator />

      {/* <ScrollArea className="w-full h-full "> */}
      <div className="overflow-hidden mb-2">
        <div
          className="px-3 flex flex-col-reverse items-start gap-4 w-full overflow-y-auto overflow-x-hidden h-full"
          onScroll={(e) => {
            if (e.target.scrollHeight + e.target.scrollTop - e.target.clientHeight < 20) {
              if (!atTopRef.current) {
                atTopRef.current = true;
                handleScrollToTop();
              }
            }
            else if (atTopRef.current)
              atTopRef.current = false;
          }}
        >
          {
            chatMessages.map((val, idx) => (
              <div
                className="w-full"
                key={idx}
              >
                {
                  "timestamp" in val &&
                    (idx >= chatMessages.length - 1 || (
                      "timestamp" in chatMessages[idx + 1] &&
                      val["timestamp"] - chatMessages[idx + 1]["timestamp"] > 300)) ?
                    <div className="m-auto text-center text-muted-foreground py-2">
                      {timestampToDateStr(val["timestamp"], now)}
                    </div> :
                    <></>
                }
                <ChatMessage
                  message={val}
                  userName={val["user_name"]}
                  isSelf={isSelf(val["user_name"])}
                  userId={val["user_id"]}
                />
              </div>
            ))
          }
        </div>
      </div>
      {/* </ScrollArea> */}

    </div >
  )
}