import { verify }   from "@node-rs/argon2";
import { sendEmail } from "../email/email.services";
import { UserServices } from "./user.services";
import { resetPwdTemplate } from "@/utils/template.helper";
import { ErrorII, InvalidCredentials } from "@/errors";


export class PasswordServices {
  /**
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  public static async verifyPassword(
    email: string, 
    password: string
  ) {
    const user = await UserServices
      .findByEmail(email, 'password');    

    if ( !await verify( user.password!, password )) {
      throw new InvalidCredentials('Incorrect password.');
    }

    return true;
  }

  /**
   * 
   * @param usrEmail 
   */
  public static async sendResetEmail(
    userEmail: string, 
    resetURL: string
  ) {
    const mailData = await sendEmail(
      userEmail,
      'Kita - Forget Account Password',
      resetPwdTemplate(resetURL)
    );
    
    if (!mailData) {
      throw new ErrorII('Failed to send email.');
    }
  }
} 
