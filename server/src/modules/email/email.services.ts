import fs from 'fs';
import path from 'path';
import config from "@/config";
import { Resend } from "resend";
import Handlebars from "handlebars";
import { InviteEmailParams } from "@/modules/organization/organization.types";
import { verifyEmail } from '../user/user.types';


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

  const { data } = await resend.emails.send({
    from:    config.mailAddress,
    to:      email,
    subject: subject,
    html:    contents
  })
  return data;
}

const src = 'src/modules/email/templates';
const inviteSource = fs.readFileSync(
  path.join(process.cwd(), `${src}/invite.html`),
  "utf-8"
);

const verifyEmailSource = fs.readFileSync(
  path.join(process.cwd(), `${src}/invite.html`),
  "utf-8"
);

const iTemplate = Handlebars.compile<InviteEmailParams>(inviteSource);
const veTemplate = Handlebars.compile<verifyEmail>(verifyEmailSource);


export const renderInvite = ( data: InviteEmailParams ) => iTemplate(data);
export const renderVerifyEmail = ( data: verifyEmail ) => veTemplate(data);
