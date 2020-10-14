import { Controller, Get, Res } from "@nestjs/common";

import type { Response } from "express";
import { base64urlencode } from "~/lib/utils/base64";

export const exampleUserId = "dcaecd32-00e7-4505-bf90-db917fff7c89";
export const exampleClientId = "39ce3891-7e0f-4f87-9bc0-db7cc2902266";
export const exampleClientRedirectUri = "http://localhost:8080/oauth2/callback/self";
export const exampleScope1Name = "contacts.read";
export const exampleScope2Name = "contacts.write";

@Controller("oauth2/help")
export class HelpController {
  @Get()
  async help(@Res() res: Response) {
    const crypto = await import("crypto");
    const querystring = await import("querystring");

    const codeVerifier = crypto.randomBytes(40).toString("hex");
    const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));

    const query = {
      response_type: "code",
      client_id: exampleClientId,
      redirect_uri: exampleClientRedirectUri,
      scope: `${exampleScope1Name} ${exampleScope2Name}`,
      state: "state-is-a-secret",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };

    return res.redirect("/oauth2/authorize?" + querystring.stringify(query));
  }
}
