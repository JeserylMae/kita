import { supabase } from "@/config/db";
import { InvalidCredentials, RecordNotFound } from "@/errors";
import { injectPropertyIntoObjects, sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "../base/base.repository";
import { NextFunction, Response } from "express";

import { 
  Brand, 
  Founder, 
  OrgMembershipParams, 
  OrgParams, 
  TableName 
} from "./organization.types";
import { UserServices } from "../user/user.services";


export class OrganizationService {
  /**
   * 
   * @param org 
   * @param brands 
   * @param founders 
   * @param membership 
   */
  public static async store(
    org: OrgParams,
    brands: Brand[],
    founders: Founder[],
    membership: OrgMembershipParams
  ) {
    // remove key-value pairs with null as value.
    const odata = sanitizeObject(org);

    const orgDB = new BaseRepository(TableName.org);
    const membershipDB = new BaseRepository(TableName.orgMem);

    const rOrg = await orgDB.upsert(odata);
    
    await OrganizationService.saveRelations(
      rOrg[0].id!,
      brands,
      founders
    );
    
    const injectPair = { org_id: rOrg[0].id!};
    const mdata = { ...membership, ...injectPair};
    await membershipDB.upsert(mdata);

    await UserServices.update(mdata.user_id!, {
      'default_org': rOrg[0].id!
    });
  }

  /**
   * 
   * @param org 
   * @param brands 
   * @param founders 
   */
  public static async update(
    org: OrgParams,
    brands: Brand[],
    founders: Founder[]
  ) {
    if (!org.id && !org.org_name) {
      throw new InvalidCredentials(
        'ID and Organization name are required.'
      );
    }

    const odata = sanitizeObject(org);
    const orgDB = new BaseRepository(TableName.org);
    
    const rOrg = await orgDB.upsert(odata);
    
    await OrganizationService.saveRelations(
      rOrg[0].id!,
      brands,
      founders
    );
  }

  /**
   * 
   * @param orgID 
   */
  public static async deleteOrg( orgID: string ) {
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
  public static async deleteHandler(
    id: string,
    table: TableName,
    res: Response,
    next: NextFunction
  ) {
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
  private static async saveRelations(
    orgID: string,
    brands: Brand[],
    founders: Founder[]
  ) {
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
}
