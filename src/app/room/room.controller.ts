import { Controller, Get, HttpService } from "@nestjs/common";
import { Observable } from "rxjs";
import type { AxiosResponse } from "axios";
import { map, tap } from "rxjs/operators";

@Controller("/room/test")
export class RoomController {
  constructor(private httpService: HttpService) {
  }

  @Get()
  getFoo() {
    return this.findAll();
  }

  findAll(): Observable<AxiosResponse<any[]>> {
    return this.httpService.get("https://api.github.com/users/jasonraimondi").pipe(
      map(response => response.data),
      tap(console.log)
    );
  }
}