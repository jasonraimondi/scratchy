import { Provider } from "@nestjs/common";
import { AuthCodeGrant } from "~/app/oauth/grants/auth_code.grant";
import { ClientCredentialsGrant } from "~/app/oauth/grants/client_credentials.grant";

export const grantProviders: Provider[] = [AuthCodeGrant, ClientCredentialsGrant];
