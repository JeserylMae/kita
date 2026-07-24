import { verify }   from "@node-rs/argon2";
import { sendEmail } from "../email/email.services";
import { renderResetPassword } from "../email/email.services";
import { ErrorII, InvalidCredentials } from "@/errors";

import * as UserServices from "./user.services";


/**
 * 
 * @param email 
 * @param password 
 * @returns 
 */
export const verifyPassword = async (
  email: string, 
  password: string
) => {
  const user = await UserServices
    .findByEmail(email, 'password');    

  if ( await verify( user.password!, password ))
    return true;
  
  throw new InvalidCredentials('Incorrect password.');
}

/**
 * 
 * @param usrEmail 
 */
export const sendResetEmail = async (
  userEmail: string, 
  resetURL: string
) => {
  const mailData = await sendEmail(
    userEmail,
    'Kita - Forget Account Password',
    renderResetPassword({resetURL})
  );
  
  if (!mailData) {
    throw new ErrorII('Failed to send email.');
  }
}
