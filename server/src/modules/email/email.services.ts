import fs from 'fs';
import path from 'path';
import config from "@/config";
import nodemailer from 'nodemailer';
import Handlebars from "handlebars";
import { ForgotPassword, InviteEmailParams } from "./email.types";
import { verifyEmail } from './email.types';


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
  try {
    const transport = nodemailer.createTransport({
      host: config.mailHost,
      port: Number(config.mailPort),
      auth: {
        user: config.mailUsername,
        pass: config.mailPassword
      }
    });

    const info = await transport.sendMail({
      from: config.mailAddress,
      to: email,
      subject: subject,
      html: contents,
    });

    console.log("Message sent:", info.messageId);
  } 
  catch (error) { throw error; }
};

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
