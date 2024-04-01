'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { httpPort, server } from "@/lib/config";
import { getAvatarURL, getId, getUserName, post, uploadDefaultAvatar } from "@/lib/utils";
import { message } from "antd";
import { LoaderCircle, LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function MePage() {
  const [imageUrl, setImageUrl] = useState(getAvatarURL(getId()));
  const [name, setName] = useState(getUserName());
  const [avatarFirstLoad, setAvatarFirstLoad] = useState(true);
  const avatarRef = useRef();

  const handleChangeIcon = (e) => {
    if (e.target.files.length === 1) {

      let file = e.target.files[0];

      let reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        console.log(e.target.result);
      }

      reader.readAsDataURL(file);
    }
  };

  const onAvatarLoad = () => {
    if (avatarFirstLoad)
      setAvatarFirstLoad(false);

    else {
      // 压缩图片为128px
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      canvas.width = 128;
      canvas.height = 128;
      context.clearRect(0, 0, 128, 128);
      context.drawImage(avatarRef.current, 0, 0, 128, 128);

      canvas.toBlob(
        (blob) => {
          const data = new FormData();
          data.append('file', blob);
          fetch("http://" + server + ":" + httpPort + "/upload-icon", {
            method: "POST",
            body: data,
            credentials: "include",
            mode: "cors",
          })
            .then((response) => {
              response.text().then(
                (text) => {
                  if (text === "SUCCESS")
                    message.success("头像上传成功", 2);
                  else
                    message.error("头像上传失败", 2);
                }
              )
            })
            .catch((e) => { console.log(e); });
        }, 'image/png'
      );
    }
  }

  const handleChangeName = () => {
    if (name.indexOf(';') !== -1) 
      message.warning("名字中不能包含\';\'", 2);

    if (name !== getUserName())
      post('/set-name', { "user_name": name })
        .then((response) => {
          if (response === "SUCCESS")
            message.success("修改成功", 2);
          else if (response === "USERNAME_DUPLICATE")
            message.error("名字重复", 2);
          else
            message.error("修改失败", 2)
        })
        .catch((e) => console.log(e));
  }

  return (
    <>
      <div className="py-8 px-4 h-10 flex items-center">
        <h5>个人资料</h5>
      </div>
      <Separator />
      <div className="flex flex-col h-full justify-center items-center gap-4">
        <div className="flex flex-col items-center gap-2 h-40">
          <input
            type="file"
            id="Self-upload"
            multiple
            accept="image/png,.jpg"
            onChange={handleChangeIcon}
            className="visually-hidden" />

          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <div className="w-32 h-32 border-border border-2 hover:border-primary transition-colors rounded-full flex justify-center items-center relative">
                {
                  imageUrl !== '' ?
                    <img src={imageUrl} ref={avatarRef} onLoad={onAvatarLoad} height={128} width={128} style={{ borderRadius: "100px" }} alt='avatar' onError={uploadDefaultAvatar}/>
                    : <LoaderIcon style={{ fontSize: "64px" }} />
                }

                <label className="w-full h-full rounded-full bg-none border-none absolute cursor-pointer" htmlFor="Self-upload"></label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              上传头像
            </TooltipContent>
          </Tooltip>
          
          <div className="flex gap-2 items-center">
            <div className="text-muted-foreground text-xs border-2 border-muted-foreground border-solid rounded-[6px] px-1 font-bold h-min">UID</div>
            {getId()}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
          <Label>名字</Label>
          <Input placeholder="2到40个字符" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button onClick={handleChangeName}>保存</Button>
      </div>
    </>
  )
}