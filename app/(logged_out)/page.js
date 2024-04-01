import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "../ui/logo";
import { Josefin_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const josefin = Josefin_Sans({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="w-screen h-screen bg-homepage bg-cover flex flex-col justify-center items-center gap-2">
      <span className={cn("font-bold text-[36px]", josefin.className)}>
        <span className="text-primary">UNO</span>
        <span>++</span>
      </span>
      <h1>全世界最 <span className="text-destructive line-through decoration-double">大</span>小 的小游戏联机平台</h1>
      <p className="text-muted-foreground">与 <span className="text-destructive line-through decoration-double">数以万计</span>寥寥无几 的玩家联机竞技！</p>
      <div className="flex gap-2 items-center">
        <Button asChild size={"lg"}>
          <Link href="/rooms">开始</Link>
        </Button>
      </div>

      <span className="absolute bottom-0 m-auto p-2 text-muted-foreground">
        Made by <a className="text-primary underline" href="https://space.bilibili.com/401603096/" target='_blank' rel='noreferrer'>Nervonment</a>
      </span>
    </div>
  )
}