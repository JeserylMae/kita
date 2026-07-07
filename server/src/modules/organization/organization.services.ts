import { InvalidCredentials } from "@/errors";
import { BaseRepository } from "../base/base.repository";
import { update as userUpdate } from "../user/user.services";

import { 
  NextFunction, 
  Response 
} from "express";
import { 
  injectPropertyIntoObjects, 
  sanitizeObject 
} from "@/utils/data.helpers";

import { 
  Brand, 
  Founder, 
  OrgMembershipParams, 
  OrgParams, 
  TableName 
} from "./organization.types";


/**
 * 
 * @param org 
 * @param brands 
 * @param founders 
 * @param membership 
 */
export const store = async (
  org: OrgParams,
  brands: Brand[],
  founders: Founder[],
  membership: OrgMembershipParams
) => {
  // remove key-value pairs with null as value.
  const odata = sanitizeObject(org);

  const orgDB = new BaseRepository(TableName.org);
  const membershipDB = new BaseRepository(TableName.orgMem);

  const rOrg = await orgDB.upsert(odata);
  
  await saveRelations(
    rOrg[0].id!,
    brands,
    founders
  );
  
  const injectPair = { org_id: rOrg[0].id!};
  const mdata = { ...membership, ...injectPair};
  await membershipDB.upsert(mdata);

  await userUpdate(mdata.user_id!, {
    'default_org': rOrg[0].id!
  });
}

/**
 * 
 * @param org 
 * @param brands 
 * @param founders 
 */
export const update = async (
  org: OrgParams,
  brands: Brand[],
  founders: Founder[]
) => {
  if (!org.id && !org.org_name) {
    throw new InvalidCredentials(
      'ID and Organization name are required.'
    );
  }

  const odata = sanitizeObject(org);
  const orgDB = new BaseRepository(TableName.org);
  
  const rOrg = await orgDB.upsert(odata);
  
  await saveRelations(
    rOrg[0].id!,
    brands,
    founders
  );
}

/**
 * 
 * @param orgID 
 */
export const deleteOrg = async ( orgID: string ) => {
  const orgDB = new BaseRepository(TableName.org);
  const brandDB = new BaseRepository(TableName.brand);
  const founderDB = new BaseRepository(TableName.founder);

  await brandDB.delete(orgID, 'org_id');
  await founderDB.delete(orgID, 'org_id');
  await orgDB.delete(orgID);
}

/**
 * 
 * @param id 
 * @param table 
 * @param res 
 * @param next 
 */
export const deleteHandler = async (
  id: string,
  table: TableName,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = new BaseRepository(table);

    await db.delete(id);

    res.status(200).json({
      'success': true,
      'message': 'Deletion successful.',
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

/**
 * 
 * @param orgID 
 * @param brands 
 * @param founders 
 */
export const saveRelations = async (
  orgID: string,
  brands: Brand[],
  founders: Founder[]
) => {
  const injectPair = { org_id: orgID };

  if (brands.length > 0) {
    const brandDB = new BaseRepository(TableName.brand);
    const bdata = injectPropertyIntoObjects(brands, injectPair);
    await brandDB.upsert(bdata);
  }
  
  if (founders.length > 0) {
    const founderDB = new BaseRepository(TableName.founder);
    const fdata = injectPropertyIntoObjects(founders, injectPair);
    await founderDB.upsert(fdata);
  }
}
