import React from "react";
import classnames from "classnames";

import { DebugNotify } from "@/app/components/debug/notify/debug-notify";
import { Link } from "@/app/components/links/link";

import el from "./debug.module.css";
import { Button } from "@/app/components/forms/elements";

export const DebugBar: React.FC = () => {
  return (
    <div className={classnames(el.debugBar)}>
      <DebugNotify />
      <Button style={{ backgroundColor: "var(--colors-black)" }}>
        <Link href="/app/profile">Restricted Page</Link>
      </Button>
    </div>
  );
};
