import { supabase } from "@/config/db";
import { ErrorII, InvalidCredentials } from "@/errors";
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
  MembershipInsert,
  OrgInsert, 
  TableName, 
  OrgUpdate,
  BrandInsert,
  FounderInsert,
  BrandUpdate,
  FounderUpdate
} from "./organization.types";
import { PostgrestError } from "@supabase/supabase-js";


/**
 * 
 * @param org 
 * @param brands 
 * @param founders 
 * @param membership 
 */
export const store = async (
  userID: string,
  org: OrgInsert,
  brands: BrandInsert[],
  founders: FounderInsert[],
  membership: MembershipInsert
) => {
  // remove key-value pairs with null as value.
  const odata = sanitizeObject(org);

  const { data, error } = await supabase
    .from(TableName.org)
    .insert(odata)
    .select('id')
    .single();

  if (error) throw new ErrorII(error.message);
  
  await storeRelations(
    data.id,
    userID,
    brands,
    founders,
    membership
  );
}

/**
 * 
 * @param org 
 * @param brands 
 * @param founders 
 */
export const update = async (
  orgID: string,
  org?: OrgUpdate,
  brands?: BrandUpdate[],
  founders?: FounderUpdate[]
) => {
  if (org) {
    const odata = sanitizeObject(org);

    const { data, error } = await supabase
      .from(TableName.org)
      .update(odata)
      .eq('id', orgID)
      .select('id');

    if (error) throw new ErrorII(error.message);
  }
  
  if (brands && brands.length >= 1 ) {
    await updateRelations(TableName.brand, orgID, brands);
  }

  if (founders && founders.length >= 1) {
    await updateRelations(TableName.founder, orgID, founders);
  }
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
  table: TableName
) => {
  const db = new BaseRepository(table);
  await db.delete(id);
}

/**
 * 
 * @param orgID 
 * @param brands 
 * @param founders 
 */
// Check whether export is necessary
const storeRelations = async (
  orgID: string,
  userID: string,
  brands: BrandInsert[],
  founders: FounderInsert[],
  membership: MembershipInsert
) => {
  const injectPair = { org_id: orgID };

  if (brands.length > 0) {
    const brandDB = new BaseRepository(TableName.brand);
    const bdata = injectPropertyIntoObjects(brands, injectPair);
    await brandDB.insert(bdata);
  }
  
  if (founders.length > 0) {
    const founderDB = new BaseRepository(TableName.founder);
    const fdata = injectPropertyIntoObjects(founders, injectPair);
    await founderDB.insert(fdata);
  }

  if (membership) {  
    const mdata = { ...membership, ...injectPair};
    const membershipDB = new BaseRepository(TableName.orgMem);
    
    await membershipDB.insert(mdata);
    await userUpdate(userID, {
      'default_org': orgID
    });
  }
}

const updateRelations = async <T extends  { id: string }>(
  table: TableName,
  orgID: string,
  records: T[]
) => {
  if (records.length === 0) return;

  for (const record of records) {
    const { id, ...updateData } = record;

    const { data, error } = await supabase
      .from(table)
      .update(updateData as Record<string, any>)
      .eq('id', id)
      .eq('org_id', orgID);

    if (error) throw new ErrorII(error.message);
  }
};