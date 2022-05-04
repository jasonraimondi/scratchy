export type NotifyMessage = {
  message: string;
  title?: string;
  ttl?: number;
};

export enum NotifyType {
  Error = "error",
  Info = "info",
  Success = "success",
}

export type Notify = {
  id: number;
  message: string;
  title?: string;
  type: NotifyType;
  isSuccess: boolean;
  isInfo: boolean;
  isError: boolean;
  ttl: number;
};

export type NotifyList = Record<number, Notify>;

export type NotifySettings = {
  ttl: number;
  suppressDuplicates: boolean;
};
