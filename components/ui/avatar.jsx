import { get, getAvatarURL, sendFriendRequest } from "@/lib/utils"
import { Avatar as AntdAvatar } from "antd"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { useEffect, useState } from "react"
import { Button } from "./button"

export default function Avatar({
  userId, userName, showInfoOnHover = false, ...props
}) {
  const ProfileCard = ({ info }) => {
    if (info)
      return (
        <div className="flex gap-2 items-center p-2">
          <Avatar userId={info["id"]} userName={info["name"]} size={56} />
          <div className="flex flex-col gap-1 items-start">
            <span className="text-lg">{info["name"]}</span>
            <span className="text-muted-foreground">{info["slogan"]}</span>
          </div>
          <Button onClick={() => sendFriendRequest(info["id"])}>添加好友</Button>
        </div>
      );
    return <></>;
  }

  const [info, setInfo] = useState();

  useEffect(() => {
    if (showInfoOnHover)
      get("/get-user-info", { id: userId })
        .then((response) => {
          setInfo(response);
        })
        .catch(console.log);
  }, [showInfoOnHover, userId]);

  if (showInfoOnHover)
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AntdAvatar
              src={getAvatarURL(userId)}
              className="bg-border"
              {...props}
            >
              {userName.substr(0, Math.min(userName.length, 2))}
            </AntdAvatar>
          </TooltipTrigger>
          <TooltipContent>
            <ProfileCard info={info} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  else return (
    <AntdAvatar
      src={getAvatarURL(userId)}
      className="bg-border"
      {...props}
    >
      {userName.substr(0, Math.min(userName.length, 2))}
    </AntdAvatar>
  );
}