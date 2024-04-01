import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomCard({
  roomName,
  roomId,
  roomType,
  ownerName,
  numOfPeople,
  handleJoin
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <span>{roomName}</span>
              <Badge>{`#${roomId}`}</Badge>
            </div>
          </CardTitle>
          <CardDescription>
            <span>{ownerName} 创建</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <span>{roomType}</span>
              <span className="flex"><Users />{numOfPeople}</span>
            </div>
            <Button variant="outline" onClick={() => handleJoin(roomId)}>加入房间</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}