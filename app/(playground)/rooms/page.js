'use client';

import { Separator } from "@/components/ui/separator"
import RoomCard from "./RoomCard"
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import { message } from "antd";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getUserName } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebSocketContext } from "../WebSocketContext";

export default function RoomsPage() {

  const ws = useContext(WebSocketContext).current;
  const router = useRouter();

  const roomIdRef = useRef();

  const [roomName, setRoomName] = useState(`${getUserName()}的房间`);
  const [roomId, setRoomId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (ws)
      try {
        ws.send(JSON.stringify({
          "message_type": "GET_ROOM_LIST"
        }));
      }
      catch (e) { }

    const eventListener = (event) => {
      const data = JSON.parse(event.data);

      if (data["message_type"] === "AUTHORIZE_RES") {
        if (data["success"])
          ws.send(JSON.stringify({
            "message_type": "GET_ROOM_LIST"
          }));
      }

      else if (data["message_type"] === "ROOM_LIST") {
        setRooms(data["room_list"]);
      }

      else if (data["message_type"] === "CREATE_ROOM_RES") {
        if (data["success"])
          router.push(`/room?id=${roomIdRef.current}`);
        else
          alert(data["info"]);
      }
    };

    if (ws) {
      ws.addEventListener(
        "message",
        eventListener
      );
    }

    return () => {
      if (ws)
        ws.removeEventListener("message", eventListener);
    }
  }, [ws, router]);

  const handleCreateRoom = () => {
    if (roomId === null || roomId === "")
      message.warning("请输入房间号", 2);
    else if (roomPassword === null || roomPassword === "")
      message.warning("请设置房间密码", 2);
    else if (roomType === "")
      message.warning("请选择游戏类型", 2);
    else {
      ws.send(JSON.stringify({
        "message_type": "CREATE_ROOM",
        "room_id": parseInt(roomId),
        "room_name": roomName,
        "room_type": roomType,
        "have_password": true,
        "password": roomPassword,
      }));
    }
  };

  const handleJoinRoom = (roomId) => {
    router.push(`/room?id=${roomId}`);
  }

  return (
    <>
      <div className="py-8 px-4 h-10 flex items-center">
        <h5>房间列表</h5>
      </div>
      <Separator />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] auto-rows-max justify-evenly gap-4 p-4 items-stretch">
        <Dialog>
          <DialogTrigger asChild>
            <div className="min-h-36 rounded-lg border-dashed border-2 border-border bg-background text-foreground shadow-sm hover:border-primary hover:text-primary transition-colors">
              <button className=" bg-none border-none w-full h-full flex items-center justify-center gap-2"><CirclePlus /> 创建房间</button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建房间</DialogTitle>
              <DialogDescription>设置房间信息</DialogDescription>
            </DialogHeader>
            <div>
              <div className="flex flex-col gap-2">
                <Label>游戏类型</Label>
                <Select onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择要一起玩的游戏" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="UNO">UNO</SelectItem>
                      <SelectItem value="SPLENDOR">璀璨宝石 (Minecraft Ver.)</SelectItem>
                      <SelectItem value="GOMOKU">五子棋（无禁手）</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Label>房间名</Label>
                <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="2~40个字符" />
                <Label>房间号</Label>
                <Input value={roomId}
                  autoComplete="off"
                  onChange={(e) => {
                    if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) < 1000000) {
                      setRoomId(`${parseInt(e.target.value)}`);
                      roomIdRef.current = `${parseInt(e.target.value)}`;
                    }
                    else if (e.target.value === "")
                      setRoomId("");
                  }}
                  type="number"
                  min={0}
                  max={999999}
                  placeholder="1~6位非负数" />
                <Label>房间密码</Label>
                <input type="text" className="w-0 h-0 absolute left-[-1000px]" name="remembered" />
                <input type="password" className="w-0 h-0 absolute left-[-1000px]" name="remembered" />
                <Input
                  value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="2~40个字符"
                />
                <Button type="submit" onClick={handleCreateRoom}>创建</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {rooms.map((val, idx) => (
          <RoomCard
            key={idx}
            roomName={val["name"]}
            roomId={val["id"]}
            roomType={
              val["type"] === "UNO" ? "UNO" :
                val["type"] === "SPLENDOR" ? "璀璨宝石 (Minecraft Ver.)" :
                  val["type"] === "GOMOKU" ? "五子棋" :
                    ""}
            ownerName={val["creator"]}
            numOfPeople={val["num_of_people"]}
            handleJoin={handleJoinRoom}
          />
        ))}
      </div>
    </>
  )
}