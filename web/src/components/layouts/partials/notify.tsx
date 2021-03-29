import { useNotify } from "use-notify-rxjs";

import style from "./notify.module.css";
import classnames from "classnames";

export function Notify() {
  const { notifications, clear } = useNotify();

  if (notifications.length === 0) {
    return <></>;
  }

  return (
    <ul className={style.list}>
      {notifications.map(notify => (
        <li key={notify.id} className={classnames(style.item, style[notify.type])}>
          <div className={style.messageContainer}>
            {notify.title && <span className={style.title}>{notify.title}</span>}
            <span className={style.message}>{notify.message}</span>
          </div>
          <span className={classnames(style.close, style[notify.type])} onClick={() => clear(notify.id)}>
            &times;
          </span>
        </li>
      ))}
    </ul>
  );
}
