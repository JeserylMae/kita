import { verifyBrcPermission } from "@/middleware/auth.middleware"
import { authorizeBranchAccess } from "@/middleware/authorization.middleware"


export const invtMiddlewares = (scope: string) => {
  return [
    verifyBrcPermission(scope),
    authorizeBranchAccess
  ];
}