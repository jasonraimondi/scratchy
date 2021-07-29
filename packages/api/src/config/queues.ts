export const QUEUE = {
  email: "email",
};

type QueueJobs = Record<string, Record<string, string>>;

export const QUEUE_JOBS: QueueJobs = {
  email: {
    send: "send",
  },
  image: {
    sync: "sync",
  },
};
