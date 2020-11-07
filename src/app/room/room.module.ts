import { HttpModule, Module } from "@nestjs/common";
import { RoomGateway } from "~/app/room/room.gateway";
import { RoomController } from "~/app/room/room.controller";

@Module({
  imports: [HttpModule.register({

  })],
  controllers: [RoomController],
  providers: [RoomGateway],
})
export class RoomModule {}
