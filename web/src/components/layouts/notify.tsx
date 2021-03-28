import { useNotify } from "use-notify-rxjs";

import style from "./notify.module.css";

export function Notify() {
  const { notifications, clear } = useNotify();

  if (notifications.length === 0) {
    return <></>;
  }

  return (
    <ul className={style.notifications}>
      {notifications.map(notify => (
        <li key={notify.type} className={style[notify.type]}>
          <span>{notify.message}</span>
          <span className={style.close} onClick={() => clear(notify.id)}>
            &times;
          </span>
        </li>
      ))}
    </ul>
  );
}
