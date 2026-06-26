import { supabase } from "@/config/db";
import { RecordNotFound } from "@/errors";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "../base/base.repository";
import { NextFunction, Response } from "express";

import { 
  Brand, 
  Founder, 
  OrgParams, 
  TableName 
} from "./organization.types";


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

  /**
   * 
   * @param params 
   */
  public static async save( params: OrgParams ) {
    const founders = (params.founders) as Founder[];
    const brands = (params.brands) as Brand[];
    const org = sanitizeObject(params);
    
    delete org.founders;
    delete org.brands;
    
    const orgDB = new BaseRepository(TableName.org);
    const rOrg = await orgDB.upsert(org);
    
    if (brands && brands.length > 0) {
      const brandDB = new BaseRepository(TableName.brand);
      
      const bData = (brands[0]?.org_id)
      ? brands
      : brands.map(b => ({ ...b, org_id: rOrg[0].id! }));
      
      await brandDB.upsert(bData);
    }
    
    if (founders && founders.length > 0) {
      const founderDB = new BaseRepository(TableName.founder);

      const fData = (founders[0]?.id)
        ? founders
        : founders.map(f => ({ ...f, org_id: rOrg[0].id! }));
      
      await founderDB.upsert(fData);
    }
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
}
