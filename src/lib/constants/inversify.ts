export const REPOSITORY = {
  UserRepository: Symbol("UserRepository"),
  EmailConfirmationRepository: Symbol("EmailConfirmationRepository"),
  ForgotPasswordRepository: Symbol("ForgotPasswordRepository"),
};

export const SERVICE = {
  Mailer: Symbol("Mailer"),
  ForgotPasswordEmail: Symbol("ForgotPasswordEmail"),
  RegisterEmail: Symbol("RegisterEmail"),
  AuthService: Symbol("AuthService"),
};
