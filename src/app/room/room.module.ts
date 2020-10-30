import { Module } from "@nestjs/common";
import { RoomGateway } from "~/app/room/room.gateway";

@Module({
  providers: [RoomGateway],
})
export class RoomModule {}
