

export interface Invitation {
  senderEmail: string;
  receiverEmail: string;
  organizationID: string;
  branchID: string;
  role: string;
  employeCode: string; 
  employmentDate: Date;
  url: string;
}

export interface InvitationUpdate {
  token?: string;
  status: 'accepted' | 'rejected' | 're-invited';
  expires_at?: Date;
  accepted_at?: Date | null;
}

export interface InviteEmailParams {
  orgName: string;
  receiverName: string;
  senderEmail: string;
  branchName: string;
  roleName: string;
  expirationDate: Date;
  acceptURL: string;
}