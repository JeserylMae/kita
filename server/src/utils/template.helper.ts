
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
