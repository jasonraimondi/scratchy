export interface IMailer {
  send(context: any): Promise<void>;
}
