import React from "react";
import classnames from "classnames";

import { DebugNotify } from "@/app/components/debug/notify/debug-notify";
import { Link } from "@/app/components/links/link";

import el from "./debug.module.css";
import { Button } from "@/app/components/forms/elements";
import { useAuth } from "@/app/lib/use_auth";

export const DebugBar: React.FC = () => {
  const { accessToken } = useAuth();
  return (
    <div className={classnames(el.debugBar)}>
      <DebugNotify />
      {accessToken && <p title={JSON.stringify(accessToken)}>Hover for Token</p>}
      <Button style={{ backgroundColor: "var(--colors-black)" }}>
        <Link href="/app/profile">Restricted Page</Link>
      </Button>
    </div>
  );
};
