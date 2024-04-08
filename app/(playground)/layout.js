'use client';

import { Nav } from "@/components/ui/nav";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn, get, getAvatarURL, getSessdata } from "@/lib/utils";
import { MessagesSquare, Network, User } from "lucide-react";
import { createContext, useEffect, useRef, useState } from "react";
import Logo from "../ui/logo";
import { message } from "antd";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { WebSocketContext } from "./WebSocketContext";
import { server, wsPort } from "@/lib/config";
import { usePathname, useRouter } from "next/navigation";

export const SetWhisperUnreadCountContext = createContext();

export default function PlaygroundLayout({ children }) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const pathname = usePathname();

  const pathnameToIdx = {
    "/rooms/": 0,
    "/rooms": 0,
    "/me/": 1,
    "/me": 1,
    "/friends/": 2,
    "/friends": 2
  };

  const [selected, setSelected] = useState(pathnameToIdx[pathname]);
  const selectedRef = useRef(pathnameToIdx[pathname]);

  const wsRef = useRef();
  const [wsContext, setWsContext] = useState({ current: null });
  const [whisperUnreadCount, setWhisperUnreadCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${server}:${wsPort}`);
    let ws = wsRef.current;
    setWsContext({ current: ws });

    // 验证登录信息
    ws.addEventListener(
      "open",
      (event) => {
        ws.send(JSON.stringify({
          "message_type": "AUTHORIZE",
          "sessdata": getSessdata()
        }));
      }
    );

    ws.addEventListener(
      "message",
      (event) => {
        const data = JSON.parse(event.data);

        if (data["message_type"] === "AUTHORIZE_RES") {
          if (!data["success"]) {
            message.warning('请登录', 2);
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }
          else
            console.log("已连接并登录");
        }

        else if (data["message_type"] === "WHISPER_MESSAGE") {
          if (selectedRef.current !== 2) {
            setWhisperUnreadCount(prev => prev + 1);
            const img = getAvatarURL(data["message"]["user_id"]);
            const text = data["message"]["type"] === "plain_text" ? data["message"]["content"] :
              data["message"]["type"] === "sticker" ? "[表情]" : "[其他消息]";
            if (Notification.permission === "default")
              Notification.requestPermission().then((result) => {
                if (result === "granted") { 
                  const notification = new Notification(data["message"]["user_name"], { body: text, icon: img });
                }
              });            
            else if(Notification.permission === "granted"){
              const notification = new Notification(data["message"]["user_name"], { body: text, icon: img });            
            }
          }
        }
      }
    )

    return () => {
      if (ws) {
        ws.close();
        console.log("连接已断开");
      }
    }
  }, [router]);

  useEffect(() => {
    get("/get-friend-list")
      .then((response) => {
        let cnt = 0;
        response.forEach(val => {
          cnt += val["unread"];
        });
        setWhisperUnreadCount(cnt);
      })
      .catch(console.log);
  }, []);


  return (
    <>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full min-h-screen items-stretch"
        >
          <ResizablePanel
            defaultChecked={265}
            collapsedSize={4}
            collapsible={true}
            minSize={14}
            maxSize={20}
            defaultSize={16}
            onCollapse={() => {
              setNavCollapsed(true);
            }}
            onExpand={() => {
              setNavCollapsed(false);
            }}
            className={cn(navCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
          >
            <div>
              <div className="py-2 flex items-center">
                <Link href={'/'}>
                  <Logo mini={navCollapsed} />
                </Link>
              </div>
              <Separator />
              <Nav
                isCollapsed={navCollapsed}
                links={[
                  {
                    title: "联机",
                    icon: Network,
                    variant: 'ghost',
                    label: '',
                    href: '/rooms'
                  },
                  {
                    title: "账户",
                    icon: User,
                    variant: 'ghost',
                    label: '',
                    href: '/me'
                  },
                  {
                    title: "好友",
                    icon: MessagesSquare,
                    variant: 'ghost',
                    label: whisperUnreadCount ? `${whisperUnreadCount}` : '',
                    href: '/friends'
                  }
                ]}
                selected={selected}
                setSelected={(v) => { setSelected(v); selectedRef.current = v; }}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={80}
          >
            <WebSocketContext.Provider value={wsContext}>
              <SetWhisperUnreadCountContext.Provider value={setWhisperUnreadCount}>
                {children}
              </SetWhisperUnreadCountContext.Provider>
            </WebSocketContext.Provider>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  )
}