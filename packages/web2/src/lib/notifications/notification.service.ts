import { get, writable } from "svelte/store";
import type { Notify, NotifyMessage, NotifySettings } from "$lib/notifications/notifications.types";
import { NotifyType } from "$lib/notifications/notifications.types";

export class NotificationService {
  private settings: NotifySettings = { ttl: 4500, suppressDuplicates: false };

  private history: Record<string, string> = {};

  private readonly CLEAR_STATE = {};

  public readonly messageList$ = writable(this.CLEAR_STATE);

  success(message: string | NotifyMessage) {
    this.flash(message, NotifyType.Success);
  }

  info(message: string | NotifyMessage) {
    this.flash(message, NotifyType.Info);
  }

  error(message: string | NotifyMessage) {
    this.flash(message, NotifyType.Error);
  }

  clear(id?: number) {
    if (id) {
      this.remove(id);
    } else {
      this.messageList$.set(this.CLEAR_STATE);
    }
  }

  private remove(id: number): void {
    const existing = get(this.messageList$);
    if (existing.hasOwnProperty(id)) {
      delete existing[id];
      this.messageList$.set(existing);
    }
  }

  private trackHistory({id, ...notify }: Notify): { isDuplicate: boolean } {
    const historyValues = Object.values(this.history);
    const historyKeys = Object.keys(this.history);
    const match = JSON.stringify(notify);
    const isDuplicate = historyValues.includes(match);

    if (!isDuplicate) {
      this.history[id] = match;
      setTimeout(() => void delete this.history[id], notify.ttl)
    }

    if (historyKeys.length >= 5) {
      const toDelete = historyKeys.shift();
      if (typeof toDelete === "string" && this.history.hasOwnProperty(toDelete)) {
        delete this.history[toDelete];
      }
    }

    return { isDuplicate }
  }

  private flash(message: string | NotifyMessage, type: NotifyType = NotifyType.Info): void {
    const id = Date.now();
    let title: string | undefined;
    let ttl = this.settings.ttl;

    if (typeof message !== "string") {
      title = message.title;
      ttl = message.ttl ?? ttl;
      message = message.message;
    }

    const notify = {
      id,
      message,
      title,
      type,
      ttl,
      isSuccess: type === NotifyType.Success,
      isInfo: type === NotifyType.Info,
      isError: type === NotifyType.Error,
    };

    let shouldAlert = true;

    if (this.settings.suppressDuplicates) {
      const { isDuplicate } = this.trackHistory(notify);
      shouldAlert = !isDuplicate;
    }

    if (shouldAlert) this.addMessageToList(notify);

    setTimeout(() => this.remove(id), ttl);
  }

  private addMessageToList(message: Notify): void {
    const messageList = {
      ...get(this.messageList$),
      [message.id]: message,
    };
    this.messageList$.set(messageList);
  }
}

export const notify = new NotificationService();
