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
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&family=Quicksand:wght@300..700&display=swap" rel="stylesheet">

    <style>
      body {
        line-height: 1rem;
        font-size: 1rem;
        font-weight: 500;
        font-family: 'Quicksand', sans-serif;
        display: flex; 
        justify-content: center; 
        width: 100vw;
        box-sizing: border-box;
        padding: 2.5rem;
        background-color: aliceblue;
      }
      p, ul {
        margin: 0.1rem;
        line-height: 2rem;
      }
      h1 {
        align-self: center;
        padding: 0rem;
        margin: 0px;
        line-height: 2.5rem;
        font-size: 2.5rem;
        font-weight: normal;
        font-family: 'Afacad', sans-serif;
      }
      h2 {
        padding: 0.5rem 0.5rem;
        margin: 0px;
        font-size: 2rem;
        font-family: 'Afacad', sans-serif;
      }
      .container {
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem 0rem 1rem;
        justify-content: center;
        align-items: center;
      }
      .gradient-text {
        background-image: linear-gradient(to right, #29C474, #C4AE29);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    </style>
  </head>

  <body>
    <div style="display: flex; 
                gap:1rem;
                flex-direction: column; 
                justify-content: center; 
                width: max-content;
                padding: 4rem;
                border-radius: 1rem;
                background-color: aliceblue;
                border: rgb(215, 215, 215) 1px solid;">

      <div style="display: flex; 
                  flex-direction: row; 
                  justify-content: center; 
                  align-items: center;">
        <img alt="kita-logo" 
            width="32px" 
            height="32px" 
            src="https://res.cloudinary.com/dqztsogsu/image/upload/v1782315995/Kita_juwpa0.ico">

        <h2> KITA </h2>
      </div>

      <h1>
        You're Invited to Join <strong class="gradient-text">${invite.orgName}</strong>
      </h1>

      <div class="container">
        <p>${invite.senderEmail} has invited you to join <strong>${invite.orgName}</strong>.</p>
        <p>You have been assigned the following access:</p>
        <ul>
          <li><strong>Branch:</strong> ${invite.branchName}</li>
          <li><strong>Role:</strong> ${invite.roleName}</li>
        </ul>
        
        <p style="margin: 1.5rem 0rem;">
          <a href="${invite.acceptURL}" 
          style="text-decoration: none; 
            color: white; 
            padding: 0.7rem; 
            background-image: linear-gradient(to right, #29C474, #C4AE29); 
            border-radius: 0.2rem;">
            <strong>Accept Invitation</strong></a>
        </p>

        <p>This invitation will expire on <strong>${invite.expirationDate}</strong>.</p>
        <p>If you weren't expecting this invitation, you can safely ignore this email.</p>
      </div>
    </div>
  </body> 
  </html>
  `)
}
