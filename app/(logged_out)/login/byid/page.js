'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { post } from '@/lib/utils';
import { md5 } from 'js-md5';
import { message } from 'antd';

const formSchema = z.object({
  uid: z.string(),
  password: z.string().min(1)
});

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      password: ""
    }
  });

  const router = useRouter();

  const onSubmit = (data) => {
    post("/login-byid", {
      "id": parseInt(data["uid"]),
      "password": md5(data["password"])
    })
      .then((response) => {
        if (response === "SUCCESS") {
          message.success('登录成功', 2);
          setTimeout(() => {
            router.push("/rooms");
          }, 1000);
        }
        else if (response === "PASSWORD_INCORRECT") 
          message.error('用户名或密码错误', 2);
        else if (response === "USER_DONOT_EXIST")
          message.error('用户不存在',2);
      })
      .catch((e) => { console.log(e) });
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            登录
          </CardTitle>
          <CardDescription>
            登录账号，与好友联机畅玩UNO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="uid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="输入你的UID" {...field} />
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
              <Button type="submit">登录</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button variant="link" onClick={() => { router.push("/login") }}> 使用用户名登录</Button>
          <div className='flex items-center'>
            <small>没有帐户？</small>
            <Button asChild variant={"link"} size={"sm"}>
              <Link href={"/signup"}>注册</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}