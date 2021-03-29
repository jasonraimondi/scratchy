import React from "react";
import classnames from "classnames";

import { DebugNotify } from "@/app/components/debug/notify/debug-notify";
import { Link } from "@/app/components/links/link";

import el from "./debug.module.css";

export const DebugBar: React.FC = () => {
  return (
    <div className={classnames(el.debugBar)}>
      <DebugNotify />
      <Link href="/app/profile" style={{ color: "var(--colors-white)" }}>
        Restricted Page
      </Link>
    </div>
  );
};
