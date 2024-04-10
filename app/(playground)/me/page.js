'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { httpPort, server } from "@/lib/config";
import { get, getAvatarURL, getId, getUserName, post } from "@/lib/utils";
import { message } from "antd";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function MePage() {
  const [id, setId] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [slogan, setSlogan] = useState('');
  const initialSloganRef = useRef();
  const [avatarFirstLoad, setAvatarFirstLoad] = useState(true);
  const avatarRef = useRef();
  const router = useRouter();

  useEffect(() => {
    setId(getId());
    setName(getUserName());
    setImageUrl(getAvatarURL(getId()));
    get("/get-user-info", { "id": getId() })
      .then((response) => {
        if (response) {
          setSlogan(response["slogan"]);
          initialSloganRef.current = response["slogan"];
        }
      })
      .catch(console.log);
  }, []);

  const handleChangeIcon = (e) => {
    if (e.target.files.length === 1) {

      let file = e.target.files[0];

      let reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        console.log("load icon");
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

      console.log("upload icon");
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
                  if (text === "SUCCESS") {
                    message.success("头像上传成功", 2);
                    setTimeout(() => {
                      router.push("/me");
                    }, 1000);
                  }
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

  const handleChangeProfile = () => {
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

    if (slogan !== initialSloganRef.current)
      post('/set-slogan', { "slogan": slogan })
        .then((response) => {
          if (response === "SUCCESS")
            message.success("修改成功", 2);
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
                    <img src={imageUrl} ref={avatarRef} onLoad={onAvatarLoad} onError={() => setAvatarFirstLoad(false)} height={128} width={128} style={{ borderRadius: "100px" }} alt='avatar' />
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
            {id}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
          <Label>名字</Label>
          <Input placeholder="2到40个字符" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
          <Label>个性签名</Label>
          <Input placeholder="40个字符以内" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
        </div>
        <Button onClick={handleChangeProfile}>保存</Button>
      </div>
    </>
  )
}