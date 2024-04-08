'use client';

import Chat from "@/app/room/Chat";
import Avatar from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { server, wsPort } from "@/lib/config";
import { cn, get, getId, getSessdata, getUserName, post, sendFriendRequest } from "@/lib/utils";
import { message } from "antd";
import { MessageSquareDashed, MessageSquareText, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";


export default function FriendsPage() {

  const ChatListTab = ({ userName, userId, message, unreadCount = 0, onClick, active = false }) => (
    <div className={cn(
      "flex gap-2 relative hover:bg-accent p-2 transition-all justify-start",
      active && "bg-primary hover:bg-primary text-primary-foreground"
    )}>
      <Avatar userName={userName} userId={userId} size={56} />
      <div className="flex flex-col items-start gap-1 max-w-[calc(100%-64px)]">
        <span className="text-lg">{userName}</span>
        <span className={cn(
          active ? "text-primary-foreground" : "text-muted-foreground",
          "text-ellipsis overflow-hidden whitespace-nowrap max-w-full"
        )}>{message}</span>
      </div>
      {
        unreadCount ?
          <Badge className="ml-auto self-center">{unreadCount}</Badge> : <></>
      }
      <button className="absolute left-0 top-0 bg-none border-none w-full h-full" onMouseDown={onClick}></button>
    </div>
  );

  const FriendRequestItem = ({ item, handleAccept, handleReject }) => (
    <div className="flex justify-between items-center w-full py-2 px-4">
      <div className="flex gap-2">
        <Avatar userName={item["name"]} userId={item["id"]} size={56} />
        <div className="flex flex-col items-start gap-2">
          <span className="text-lg font-bold">{item["name"]}</span>
          <span className="text-muted-foreground">{item["slogan"]}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleReject}>拒绝</Button>
        <Button variant="default" onClick={handleAccept}>接受</Button>
      </div>
    </div>
  );

  const FriendRequestList = () => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
      get('/get-friend-requests')
        .then((response) => {
          if (response === "FAILED")
            message.warning("获取好友请求列表失败", 2);
          else
            setFriendRequests(response);
        })
        .catch(console.log);
    }, []);

    const handleAcceptOrReject = (accept, id) => {
      post('/handle-friend-request', {
        "accept": accept,
        "requester_id": id
      })
        .then((response) => {
          if (response === "SUCCESS") {
            if (accept) {
              message.success("已接受好友请求", 2);
            }
            setFriendRequests(
              prev => {
                prev.splice(prev.find(r => r["id"] === id), 1);
                return prev.slice();
              }
            )
          }
        })
        .catch(console.log);
    }

    if (friendRequests.length)
      return (
        <>
          {
            friendRequests.map((request, idx) => (
              <div key={idx}>
                <FriendRequestItem
                  item={request}
                  handleAccept={() => handleAcceptOrReject(true, request["id"])}
                  handleReject={() => handleAcceptOrReject(false, request["id"])}
                />
                <Separator />
              </div>
            ))
          }
        </>
      )

    return (
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full">
        <MessageSquareDashed size={72} />
        <span>暂时没有好友请求</span>
      </div>
    )
  }

  const [currentChatIdx, setCurrentChatIdx] = useState(-1);
  const currentFriendIdRef = useRef(-1);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const [searchUserId, setSearchUserId] = useState();
  const [chatHistory, setChatHistory] = useState([]);
  const [unreadCount, setUnreadCount] = useState({});

  const chatHistoryIdx =
    useMemo(() =>
      chatHistory
        .map((val, idx) => ({ idx, time: val["messages"].length ? val["messages"][0]["timestamp"] : 0 }))
        .sort((a, b) => b.time - a.time), [chatHistory]);

  const wsRef = useRef();

  const router = useRouter();

  useEffect(() => {
    get("/get-friend-list")
      .then((response) => {
        setUnreadCount((prev) => {
          setChatHistory(response.map((val, idx) => {
            prev[`${val["id"]}`] = val["unread"];

            return {
              "friend_name": val["name"],
              "friend_id": val["id"],
              "friend_slogan": val["slogan"],
              "messages": []
            };
          }));

          return { ...prev };
        });

        get("/get-chat-history")
          .then((response) => {
            setChatHistory((prev) => {
              for (let chat of prev) {
                if (`${chat["friend_id"]}` in response)
                  chat["messages"] = response[`${chat["friend_id"]}`].sort(
                    (a, b) => b["timestamp"] - a["timestamp"]
                  );
              }
              return prev.slice();
            });
          })
          .catch(console.log);
      })
      .catch(console.log);

  }, []);

  useEffect(() => {
    wsRef.current = new WebSocket(`ws://${server}:${wsPort}`);
    let ws = wsRef.current;

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
        }

        else if (data["message_type"] === "WHISPER_MESSAGE") {
          const friendId = data["receiver_id"] === getId() ?
            data["message"]["user_id"] : data["receiver_id"];

          setChatHistory((prev) => {
            let after = prev.map(v => {
              if (v["friend_id"] === friendId) {
                let new_v = { ...v, "messages": v["messages"].slice() };
                new_v["messages"].unshift(data["message"]);
                return new_v;
              }
              else return { ...v };
            });
            return after;
          });

          if (friendId !== currentFriendIdRef.current)
            setUnreadCount(prev => {
              let after = { ...prev };
              after[`${friendId}`] += 1;
              return after;
            });
        }
      }
    )

    return () => {
      if (ws) {
        try {
          ws.send(JSON.stringify({
            "message_type": "READ_WHISPER_MESSAGES",
            "friend_id": currentFriendIdRef.current,
          }));
        } catch (e) {
        };
        ws.close();
      }
    }
  }, []);

  const handleAddFriend = () => {
    sendFriendRequest(
      parseInt(searchUserId),
      () => {
        setAddFriendDialogOpen(false);
        setSearchUserId('');
      }
    );
  };

  const handleSendMessage = (msg, receiverId) => {
    wsRef.current.send(JSON.stringify({
      "message_type": "WHISPER_MESSAGE",
      "receiver_id": receiverId,
      "message": msg
    }));
  }

  const handleReadMessage = (friendId) => {
    if (unreadCount[`${friendId}`])
      wsRef.current.send(JSON.stringify({
        "message_type": "READ_WHISPER_MESSAGES",
        "friend_id": friendId,
      }));
    setUnreadCount(prev => {
      prev[`${friendId}`] = 0;
      return { ...prev };
    });
  }

  const get20Messages = (friendId, latestTimeStamp) => {
    get("/get-chat-history-20", {
      "friend_id": friendId,
      "latest_timestamp": latestTimeStamp
    })
      .then((response) => {
        setChatHistory((prev) => {
          let after = prev.map(v => {
            if (v["friend_id"] === friendId) {
              let new_v = { ...v, "messages": v["messages"].slice() };
              new_v["messages"] = [...new_v["messages"], ...response];
              return new_v;
            }
            else return { ...v };
          });
          return after;
        });
      })
      .catch(console.log);
  }

  return (
    <Tabs defaultValue="chat" className="w-full h-full">
      <TabsList className="grid w-fit grid-cols-2 m-3">
        <TabsTrigger value="chat">私信</TabsTrigger>
        <TabsTrigger value="requests">好友请求</TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value="chat" className="h-[calc(100vh-65px)] m-0">
        <Dialog
          open={addFriendDialogOpen}
          onOpenChange={setAddFriendDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>通过UID添加好友</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label>玩家UID</Label>
              <Input value={searchUserId} onChange={(e) => setSearchUserId(e.target.value)} placeholder="请输入对方的UID" />
            </div>
            <Button type="submit" onClick={handleAddFriend}>发送好友请求</Button>
          </DialogContent>
        </Dialog>
        <div className="h-full flex">
          <div className="w-72 overflow-y-auto">
            <Button
              className="w-full flex gap-1 text-muted-foreground rounded-none"
              variant="ghost"
              onClick={() => setAddFriendDialogOpen(true)}
            >
              <PlusCircle /> 添加好友
            </Button>
            <Separator />
            {
              chatHistoryIdx.map((val, idx) => (
                <div key={idx}>
                  <ChatListTab
                    userName={chatHistory[val.idx]["friend_name"]}
                    userId={chatHistory[val.idx]["friend_id"]}
                    message={chatHistory[val.idx]["messages"].length > 0 ? (
                      chatHistory[val.idx]["messages"][0]["type"] === "plain_text" ?
                        chatHistory[val.idx]["messages"][0]["content"] : "[表情]") :
                      ''
                    }
                    unreadCount={unreadCount[`${chatHistory[val.idx]["friend_id"]}`]}
                    onClick={() => {
                      setCurrentChatIdx(val.idx);
                      currentFriendIdRef.current = chatHistory[val.idx]["friend_id"];
                      handleReadMessage(chatHistory[val.idx]["friend_id"]);
                    }}
                    active={val.idx === currentChatIdx}
                  />
                  <Separator />
                </div>
              ))
            }
          </div>
          <Separator orientation="vertical" />
          {
            currentChatIdx !== -1 ?
              <div className="w-[calc(100%-288px)] h-full flex flex-col">
                <div className="h-[64px] flex flex-col px-4 justify-center">
                  <span className="text-xl font-bold">{chatHistory[currentChatIdx]["friend_name"]}</span>
                  <span className="text-xs text-muted-foreground">{chatHistory[currentChatIdx]["friend_slogan"]}</span>
                </div>
                <Separator />
                <div className="flex-1 overflow-hidden">
                  <Chat
                    chatMessages={chatHistory[currentChatIdx]["messages"]}
                    isSelf={(name) => getUserName() === name}
                    handleSendMessage={(msg) => {
                      handleSendMessage(msg, chatHistory[currentChatIdx]["friend_id"]);
                    }}
                    handleScrollToTop={() => {
                      get20Messages(
                        chatHistory[currentChatIdx]["friend_id"],
                        chatHistory[currentChatIdx]["messages"][
                        chatHistory[currentChatIdx]["messages"].length - 1
                        ]["timestamp"]
                      );
                    }}
                  />
                </div>
              </div> :
              <div className="flex items-center justify-center w-[calc(100%-288px)] h-full text-muted">
                <MessageSquareText size={72} />
              </div>
          }
        </div>
      </TabsContent>
      <TabsContent value="requests" className="h-[calc(100vh-74px)]">
        <FriendRequestList />
      </TabsContent>
    </Tabs>
  )
}