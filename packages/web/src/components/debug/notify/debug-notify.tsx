import React from "react";
import { useNotify } from "use-notify-rxjs";
import classnames from "classnames";

import { Button } from "@/app/components/forms/elements";

import el from "./debug-notify.module.css";

export const DebugNotify = () => {
  const notify = useNotify();

  const handleInfo = () => notify.info({ title: "This is a title", message: "hi ya slugger!" });
  const handleError = () =>
    notify.error({ title: "This is a title", message: "ut oh, something terrible went wrong!" });
  const handleSuccess = () =>
    notify.success({ title: "This is a title", message: "wow awesome job everything went great!" });
  const handleLong = () =>
    notify.success(
      "great job slugger! great job slugger! great job slugger! great job slugger! great job slugger! great job slugger! great job slugger! great job slugger! great job slugger! great job slugger! great job slugger!",
    );

  return (
    <ul className={el.notifyList}>
      <li>
        <Button onClick={handleInfo} className={classnames(el.notify, el.notifyInfo)}>
          Info
        </Button>
      </li>
      <li>
        <Button onClick={handleError} className={classnames(el.notify, el.notifyError)}>
          Error
        </Button>
      </li>
      <li>
        <Button onClick={handleSuccess} className={classnames(el.notify, el.notifySuccess)}>
          Success
        </Button>
      </li>
      <li>
        <Button onClick={handleLong} className={classnames(el.notify, el.notifySuccess)}>
          Long
        </Button>
      </li>
    </ul>
  );
};
