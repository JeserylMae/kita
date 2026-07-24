import { createDocument } from "zod-openapi";
import type { OpenAPIObject } from "openapi3-ts/oas31";

import * as user from "../modules/user/user.openapi";
import * as org from "../modules/organization/organization.openapi";
import * as invite from "../modules/invitation/invitation.openapi";
import * as txn from "../modules/inventory/transaction/transaction.openapi";
import * as prd from "../modules/inventory/product/product.openapi";
import * as mov from "../modules/inventory/movement/movement.openapi";
import * as item from "../modules/inventory/items/items.openapi";
import * as brc from "../modules/branch/branch.openapi";


const openapiDocument: OpenAPIObject = createDocument({
  openapi: "3.1.0",

  info: {
    title: "Kita API",
    version: "1.0.0",
    description: "Kita Inventory Management System API",
  },

  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local development server",
    },
  ],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "acstoken",
      },
    },
  },

  paths: {
    "/user/signup":  user.SignupPath,
    "/user/signin":  user.SigninPath,
    "/user/logout":  user.LogoutPath,
    '/user/refresh': user.RefreshPath,
    "/user/reset-password":      user.ResetPasswordPath,
    "/user/forgot-password":     user.ForgotPasswordPath,
    "/user/verify-email":        user.VerifyEmailPath,
    "/user/resend-verification": user.ResendEmailVerificationPath,
    "/user/me":     user.MePath,
    "/user/me/{id": user.UserUpdatePath,
    "/user/{id}":   user.UserUpdatePath,

    "/organization/memberships/me":      org.GetOrganizationsPath,
    "/organization/switch/{id}":         org.SwitchOrganizationPath,
    "/organization/{orgID}/member/{id}": org.UpdateMemberPath,
    "/organization/founder/{id}":        org.DeleteFounderPath,
    "/organization/brand/{id}":          org.DeleteBrandPath,
    "/organization/member/{id}":         org.DeleteMemberPath,
    
    "/organization/{id}": { 
      ...org.GetMembersPath,
      ...org.UpdateOrganizationPath
    },
    "/organization/": {
      ...org.CreateOrganizationPath,
      ...org.DeleteOrgPath
    },

    "/invitation/":        invite.InvitePath,
    "/invitation/{token}": invite.RespondToInvitationPath,
    "/invitation/me{id}":      invite.GetInvitationsPath,

    "/invitation/{id}": {
      ...invite.ReinvitePath,
      ...invite.DeleteInvitationPath
    },

    "/inventory/transaction":        txn.FindAllTransactionsPath,
    "/inventory/transaction/details": txn.FindTransactionDetailsPath,

    "/inventory/product/{id}": {
      ...prd.CreateProductPath,
      ...prd.UpdateProductPath,
      ...prd.DeleteProductPath,
      ...prd.CreateProductPath
    },
    
    "/inventory/product/variant/{id}": {
      ...prd.UpdateProductVariantPath,
      ...prd.DeleteProductVariantPath
    },
    
    "/inventory/movement": {
      ...mov.GetMovementPath,
      ...mov.PostMovementPath
    },

    "/inventory/movement/{id}": {
      ...mov.PatchMovementPath,
      ...mov.DeleteMovementPath
    },

    "/inventory/items": {
      ...item.ItemInsertPath,
      ...item.GetItemsPath
    },

    "/inventory/items/{id}": {
      ...item.ItemUpdatePath,
      ...item.DeleteItemPath
    },

    "/branch/": brc.CreateBranchPath,
    "/branch/members/": brc.FindMembersPath,
    
    "/branch/{id}": {
      ...brc.SelectBranchPath,
      ...brc.UpdateBranchPath,
      ...brc.DeleteBranchPath
    },

    "/branch/member/{id}": {
      ...brc.UpdateMemberPath,
      ...brc.DeleteMemberPath
    },
  },

  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],
});

export default openapiDocument;