export enum QUEUE {
  email = "email",
}

type QueueJobs = Record<QUEUE, Record<string, string>>;

export const QUEUE_JOBS: QueueJobs = {
  email: {
    send: "send",
  },
};
