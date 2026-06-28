

export const canAccessUser = (
  scope: string[], requesterID: string, targetUserID: string
) => {
  if (scope.includes("ORG")) {
    return requesterID  === targetUserID;
  }

  if (scope.includes("BRC")) {
    return requesterID === targetUserID;
  }

  if (scope.includes("SELF")) {
    return requesterID === targetUserID;
  }

  return false;
}