'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Chat from "./Chat";
import PlayerList from "./PlayerList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { server, wsPort } from "@/lib/config";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { getSessdata } from "@/lib/utils";
import useUno from "@/lib/useUno";
import useSplendor from "@/lib/useSplendor";
import UnoGame from "./Uno/UnoGame";
import SplendorGame from "./Splendor/SplendorGame";
export default function RoomPage({ params }) {

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  useEffect(() => {
    setJoinDialogOpen(true);
  }, []); // Prevent the Hydration Error

  const [roomPassword, setRoomPassword] = useState("");
  const [roomType, setRoomType] = useState("");
  const [userName, setUserName] = useState();
  const [roomMembers, setRoomMembers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const userNameRef = useRef();
  const wsRef = useRef();

  const router = useRouter();

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${server}:${wsPort}`);
    let ws = wsRef.current;

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
          if (data["success"]) {
            setUserName(data["user_name"]);
            userNameRef.current = data["user_name"];
          }
          else {
            message.warning("请登录", 2);
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        }

        else if (data["message_type"] === "ERROR") {
          alert(data["info"]);
        }

        else if (data["message_type"] === "JOIN_ROOM_RES") {
          if (data["success"]) {
            setJoinDialogOpen(false);
            setRoomType(data["room_type"])
          }
          else
            alert(data["info"]);
        }

        else if (data["message_type"] === "ROOM_MEMBERS_INFO")
          setRoomMembers(data["members"]);

        else if (data["message_type"] === "CHAT_MESSAGE") {
          setChatMessages((prev) => [data["message"], ...prev]);
        }
      }
    )

    return () => {
      if (ws)
        ws.close();
    }
  }, []);


  const handleJoinRoom = () => {
    if (roomPassword === null || roomPassword === "")
      message.warning("请输入房间密码", 2);
    else {
      wsRef.current.send(JSON.stringify({
        "message_type": "JOIN_ROOM",
        "room_id": parseInt(roomId),
        "password": roomPassword
      }));
    }
  }

  const handleSendMessage = (msg) => {
    wsRef.current.send(JSON.stringify({
      "message_type": "CHAT_MESSAGE",
      "room_id": parseInt(roomId),
      "message": msg
    }));

    if (msg["type"] === "plain_text" && msg["content"].toLowerCase() === "uno")
      wsRef.current.send(JSON.stringify({
        "message_type": "UNO_SAY_UNO",
        "room_id": parseInt(roomId)
      }));
  }

  const [prepared, setPrepared] = useState(false);
  const handlePrepare = () => {
    wsRef.current.send(JSON.stringify({
      "message_type": "GAME_PREPARE",
      "room_id": parseInt(roomId),
      "prepare": !prepared
    }));
    setPrepared(!prepared);
  }

  const handleGameStart = useCallback(() => {
    setPrepared(false);
    setGameStarted(true);
  }, []);
  const handleGameOver = useCallback(() => {
    setGameStarted(false);
  }, []);
  const pushChatMessage = useCallback((msg) => {
    setChatMessages((prev) => [msg, ...prev]);
  }, []);

  return (
    <>
      <Dialog
        open={joinDialogOpen}
        onOpenChange={(val) => {
          setJoinDialogOpen(val);
          if (!val)
            router.push("/rooms")
        }}
      >
        <DialogPortal>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>加入房间</DialogTitle>
              <DialogDescription>输入房间密码</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label>房间密码</Label>
              <Input value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} type="password" placeholder="请输入房间密码" />
            </div>
            <Button type="submit" onClick={handleJoinRoom}>加入</Button>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <div className="absolute top-0 h-0 w-screen text-center z-10">
        <span className="border-2 rounded-b-md py-2 px-4 bg-background">
          <span className="text-muted-foreground">房间</span>
          &nbsp;
          {roomId}
        </span>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="h-full min-h-screen"
      >
        <ResizablePanel
          minSize={24}
          maxSize={36}
          defaultSize={24}
        >
          <ResizablePanelGroup
            direction="vertical"
            className="w-full"
          >
            <ResizablePanel
              minSize={24}
            >
              <div className="flex justify-between items-center h-12 py-2 px-4">
                <h6>玩家列表</h6>
                {
                  gameStarted ?
                    <></> :
                    <Button size="sm" variant="outline" onClick={handlePrepare}>
                      {prepared ? "取消" : "准备"}
                    </Button>
                }
              </div>
              <Separator />
              <PlayerList
                players={roomMembers}
                isSelf={(val) => val === userName}
                gameStarted={gameStarted}
                roomId={roomId}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              minSize={36}
            >
              <Chat
                chatMessages={chatMessages}
                isSelf={(name) => name === userName}
                handleSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          {
            roomType === "UNO" ?
              <UnoGame
                ws={wsRef.current}
                roomId={roomId}
                pushChatMessage={pushChatMessage}
                gameStarted={gameStarted}
                handleGameStart={handleGameStart}
                handleGameOver={handleGameOver}
              /> :
              roomType === "SPLENDOR" ?
                <SplendorGame
                  ws={wsRef.current}
                  pushChatMessage={pushChatMessage}
                  gameStarted={gameStarted}
                  handleGameStart={handleGameStart}
                  handleGameOver={handleGameOver}
                /> :
                <></>
          }
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}