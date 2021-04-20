import classnames from "classnames";
import { useNotify } from "use-notify-rxjs";

import el from "./notify.module.css";

export function Notify() {
  const { notifications, clear } = useNotify();

  if (notifications.length === 0) {
    return <></>;
  }

  return (
    <ul className={el.list}>
      {notifications.map(notify => (
        <li key={notify.id} className={classnames(el.item, el[notify.type])}>
          <div className={el.messageContainer}>
            {notify.title && <span className={el.title}>{notify.title}</span>}
            <span className={el.message}>{notify.message}</span>
          </div>
          <span className={classnames(el.close, el[notify.type])} onClick={() => clear(notify.id)}>
            &times;
          </span>
        </li>
      ))}
    </ul>
  );
}
