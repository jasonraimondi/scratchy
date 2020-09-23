import crypto from "crypto";
import { ICodeChallenge } from "~/app/oauth/code_verifiers/verifier";

import { base64urlencode } from "~/lib/utils/base64";

export class S256Verifier implements ICodeChallenge {
  public readonly method = "S256";

  verifyCodeChallenge(codeVerifier: string, codeChallenge: string): boolean {
    const hash = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));
    return codeChallenge === hash;
  }
}
