import fs from 'fs';
import path from 'path';
import config from "@/config";
import { Resend } from "resend";
import Handlebars from "handlebars";
import { InviteEmailParams } from "@/modules/organization/organization.types";


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


const inviteSource = fs.readFileSync(
  path.join(process.cwd(), "templates/invite.html"),
  "utf-8"
);

const template = Handlebars.compile<InviteEmailParams>(inviteSource);

export const renderInvite = ( data: InviteEmailParams ) => template(data);