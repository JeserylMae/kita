import { InviteEmailParams } from "@/modules/organization/organization.types";

export const ConsoleColor = {
  ERROR:    '\x1b[31m',
  INFO:     '\x1b[34m',
  WARNING:  '\x1b[33m',
  SUCCESS:  '\x1b[32m',
  RESET:    '\x1b[0m',
}

export const resetPwdTemplate = (resetURL: string) => {
  return (`
    <body style="width: 100%; display: flex; justify-content: center;">
      <div style="padding: 5rem 5rem; border-top: 0.2rem lime solid; border-bottom: 0.2rem lime solid; width: max-content">
        <h1>Reset Your Password</h1>
        <p>Hi!</p>
        <p>We've receive a request to reset your password. </p>
        <p>If you didn't make the request simply ignore this email. Otherwise, your can reset your password.</p>
        <br>
        <a href="${resetURL}" style="padding: 1rem; background-color: lime;">Reset Password</a>
      </div>
    </body>
  `);
}

export const inviteTemplate = (
  invite: InviteEmailParams
) => {
  return (`
    <body style="display: flex; justify-content: center; width: 100%; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="display: flex; flex-direction: column; justify-content: center; width: max-content;">

        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
          <img src="https://res.cloudinary.com/dqztsogsu/image/upload/v1782315995/Kita_juwpa0.ico" alt="kita-logo" width="32px" height="32px">
          <h1 style="padding: 0.5rem;">KITA</h1>
        </div>

        <h2 style="align-self: center;">You're Invited to Join <strong style="color: #29C474;">${invite.orgName}</strong></h2>

        <p>Hello ${invite.receiverName},</p>
        <p>${invite.senderEmail} has invited you to join <strong>${invite.orgName}</strong>.</p>
        <p>You have been assigned the following access:</p>
        <ul>
          <li><strong>Branch:</strong> ${invite.branchName}</li>
          <li><strong>Role:</strong> ${invite.roleName}</li>
        </ul>

        <p>By accepting this invitation, you'll gain access to the branch and permissions associated with the assigned role. </p>

        <p>This invitation will expire on <strong>${invite.expirationDate}</strong>.</p>
        <p>
          <a href="${invite.acceptURL}" 
          style="text-decoration: none; 
            color: white; 
            padding: 0.7rem; 
            background-color: #29C474; 
            border-radius: 0.2rem;">
            <strong>Accept Invitation</strong></a>
        </p>

        <p>If you weren't expecting this invitation, you can safely ignore this email.</p>

        <p>
          Best regards,<br>
          <strong style="color: #29C474;">The Kita Team</strong>
        </p>
      </div>
    </body>  
  `)
}
