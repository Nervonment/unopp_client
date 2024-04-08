"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { Badge } from "./badge"


export function Nav({ links, isCollapsed, selected, setSelected }) {

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  onClick={() => setSelected(index)}
                  className={cn(
                    buttonVariants({ variant: index == selected ? 'default' : 'ghost', size: "icon" }),
                    "relative h-9 w-9",
                    index == selected &&
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                  {link.label ? (
                    <Badge className="absolute right-[-4px] top-[-4px]">
                      {link.label}
                    </Badge>
                  ) : <></>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              onClick={() => setSelected(index)}
              href={link.href}
              className={cn(
                buttonVariants({ variant: index == selected ? 'default' : 'ghost', size: "sm" }),
                index == selected &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <Badge
                  className="ml-auto"
                >
                  {link.label}
                </Badge>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}