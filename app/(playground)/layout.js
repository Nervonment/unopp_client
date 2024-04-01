'use client';

import { Nav } from "@/components/ui/nav";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Network, User } from "lucide-react";
import { useState } from "react";
import Logo from "../ui/logo";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function PlaygroundLayout({ children }) {
  const [navCollapsed, setNavCollapsed] = useState(false);

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
              <div className="p-2">
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
                  }
                ]}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  )
}