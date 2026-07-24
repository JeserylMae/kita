

export interface InviteEmailParams {
  orgName:        string;
  senderEmail:    string;
  branchName:     string;
  roleName:       string;
  expirationDate: Date;
  acceptURL:      string;
};

export interface verifyEmail {
  email:     string;
  acceptURL: string;
};


export interface ForgotPassword {
  resetURL: string;
};