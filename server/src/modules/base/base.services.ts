import { InvalidCredentials } from "@/errors";


export const canAccessUser = ( scope: string[] | undefined ) => {
  const errMsg = 'You do not have sufficient permissions for this operation.'

  if (!scope) {
    throw new InvalidCredentials(errMsg);
  }

  if (scope.includes("ORG")) {
    return true;
  }

  if (scope.includes("BRC")) {
    return true;
  }

  if (scope.includes("SELF")) {
    return true;
  }

  throw new InvalidCredentials(errMsg);
}