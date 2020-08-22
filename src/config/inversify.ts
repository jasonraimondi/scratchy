export const REPOSITORY = {
  UserRepository: Symbol("UserRepository"),
  EmailConfirmationRepository: Symbol("EmailConfirmationRepository"),
  ForgotPasswordRepository: Symbol("ForgotPasswordRepository"),
};

export const QUEUE = {
  email: "email",
};

export const QUEUE_JOBS = {
  email: {
    send: "send",
  },
};

// why you asking what is an example of a high pressure situation you handled
