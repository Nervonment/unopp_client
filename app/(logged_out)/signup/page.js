'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { post, uploadDefaultAvatar } from '@/lib/utils';
import { md5 } from 'js-md5';
import { message } from 'antd';

const formSchema = z.object({
  userName: z.string().min(1).max(40),
  password: z.string().min(6).max(40),
  passwordEnsure: z.string().min(6).max(40)
});

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
      passwordEnsure: ""
    }
  });

  const router = useRouter();

  const onSubmit = (data) => {
    if (data["password"] !== data["passwordEnsure"])
      message.warning("两次输入密码不一致");

    else if (data["userName"].indexOf(';') !== -1)
      message.warning("名字中不能包含\';\'", 2);

    else {
      post("/register", {
        "user_name": data["userName"],
        "password": md5(data["password"])
      })
        .then((response) => {
          if (response === "SUCCESS") {
            message.success("注册成功", 2);
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }
          else if (response === "USERNAME_DUPLICATE") {
            message.error("名字重复", 2);
          }
          else if (response === "FAILED") {
            message.error("注册失败", 2);
          }
        })
        .catch((e) => { console.log(e) });
    }
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            注册
          </CardTitle>
          <CardDescription>
            注册账号，与好友联机畅玩UNO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名字</FormLabel>
                    <FormControl>
                      <Input placeholder="输入你的名字" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="输入你的密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordEnsure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="再次确认密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">注册</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end items-center">
          <div className='flex items-center'>
            <small>已有帐户？</small>
            <Button asChild variant={"link"} size={"sm"}>
              <Link href={"/login"}>登录</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}