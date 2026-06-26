import { supabase } from "@/config/db";
import { Brand, Founder, OrgParams, TableName } from "./organization.types";
import { ErrorII, InvalidCredentials, RecordNotFound } from "@/errors";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "../base/base.repository";
import { NextFunction, Response } from "express";

export class OrganizationService {
  /**
   * 
   * @param userID 
   * @param options 
   * @returns 
   */
  public static async find(
    userID: string,
    options?: {
      withBranches?: boolean,
      defaultOrgOnly?: boolean
    }
  ) {
    /**
     * organization_members.org_id = organizations.id
     */
    let slctStr = (`
      org_id,
      is_default_org,
      employee_code,
      status,
      organizations( org_name, icon, hex_color )
    `);

    if (options?.withBranches) {
      /**
       * organization_members.id = branch_members.org_mem_id
       * branch_members.branch_id = branches-id
       */
      slctStr += (`
        ,
        branch_members (
          branch_id,
          role,
          status,
          starred,
          branches( branch_name, icon, color )
        )
      `);
    }

    let query = options?.withBranches ?
      supabase
        .from('organization_members')
        .select(slctStr)
        .eq('user_id', userID)
        .eq('organizations.status', 'active')
        .eq('branches.status', 'active')
      : supabase 
        .from('organization_members')
        .select(slctStr)
        .eq('user_id', userID)
        .eq('organizations.status', 'active');
    
    query = options?.defaultOrgOnly ?
      query.eq('is_default_org', true)
      : query;

    query.eq('status', 'active');

    const { data, error } = await query;
    
    if (!error) return data;
    
    throw new RecordNotFound(
      'Failed to fetch organization list.'
    );
  }

  public static async save( params: OrgParams ) {
    const founders = (sanitizeObject(params.founders)) as Founder[];
    const brands = (sanitizeObject(params.brands)) as Brand[];
    const org = sanitizeObject(params);

    delete org.founders, org.brands;

    const orgDB = new BaseRepository(TableName.org);
    const brandDB = new BaseRepository(TableName.brand)
    const founderDB = new BaseRepository(TableName.founder);
    
    const rOrg = await orgDB.upsert(org);
    
    const bData = brands.map(b => ({ ...b, org_id: rOrg[0].id! }));
    const fData = founders.map(f => ({ ...f, org_id: rOrg[0].id! }))

    await brandDB.upsert(bData);
    await founderDB.upsert(fData);
  }

  public static async deleteOrg( orgID: string ) {
    const orgDB = new BaseRepository(TableName.org);
    const brandDB = new BaseRepository(TableName.brand);
    const founderDB = new BaseRepository(TableName.founder);

    await brandDB.delete(orgID, 'org_id');
    await founderDB.delete(orgID, 'org_id');
    await orgDB.delete(orgID);
  }

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
}
