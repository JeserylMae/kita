import config from "@/config";
import { Resend } from "resend";


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
