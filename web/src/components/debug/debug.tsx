import React from "react";
import classnames from "classnames";

import { DebugNotify } from "@/app/components/debug/notify/debug-notify";
import { Link } from "@/app/components/links/link";

import el from "./debug.module.css";
import { Button } from "@/app/components/forms/elements";
import { useAuth } from "@/app/lib/use_auth";

export const DebugBar: React.FC = () => {
  const { token } = useAuth();
  return (
    <div className={classnames(el.debugBar)}>
      <DebugNotify />
      {token && <p title={JSON.stringify(token)}>Hover for Token</p>}
      <Button style={{ backgroundColor: "var(--colors-black)" }}>
        <Link href="/app/profile">Restricted Page</Link>
      </Button>
    </div>
  );
};
