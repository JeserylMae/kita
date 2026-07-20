import fs from 'fs';
import path from 'path';
import config from "@/config";
import { Resend } from "resend";
import Handlebars from "handlebars";
import { ForgotPassword, InviteEmailParams } from "./email.types";
import { verifyEmail } from './email.types';
import { ErrorII } from '@/errors';


/**
 * 
 * @param email 
 * @param subject 
 * @param contents 
 * @returns 
 */
export const sendEmail = async (
  email: string, 
  subject: string,
  contents: string
) => {
  const resend = new Resend(config.mailAPI);

  const { data, error } = await resend.emails.send({
    from:    config.mailAddress,
    to:      email,
    subject: subject,
    html:    contents
  })

  if (!error) return data; 
    
  throw new ErrorII(error.message);
}

const src = 'src/modules/email/templates';
const inviteSource = fs.readFileSync(
  path.join(process.cwd(), `${src}/invite.html`),
  "utf-8"
);

const verifyEmailSource = fs.readFileSync(
  path.join(process.cwd(), `${src}/verify-email.html`),
  "utf-8"
);

const resetPasswordSource = fs.readFileSync(
  path.join(process.cwd(), `${src}/reset-password.html`),
  "utf-8"
);

const iTemplate = Handlebars.compile<InviteEmailParams>(inviteSource);
const veTemplate = Handlebars.compile<verifyEmail>(verifyEmailSource);
const rpTemplate = Handlebars.compile<ForgotPassword>(resetPasswordSource);

export const renderInvite = ( data: InviteEmailParams ) => iTemplate(data);
export const renderVerifyEmail = ( data: verifyEmail ) => veTemplate(data);
export const renderResetPassword = ( data: ForgotPassword ) => rpTemplate(data);
