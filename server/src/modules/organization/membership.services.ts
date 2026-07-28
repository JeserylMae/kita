import { supabase } from "@/config/db";
import { BaseRepository } from "../base/base.repository";
import { sanitizeObject } from "@/utils/data.helpers";
import { 
  MembershipPagination,
  MembershipSelect, 
  MembershipUpdate, 
  OrgPagination, 
  TableName 
} from "./organization.types";
import { 
  ErrorII, 
  InvalidCredentials, 
  RecordNotFound 
} from "@/errors";
import { builtinModules } from "node:module";
import { handleCursor, handleNextPage } from "../base/base.services";


export const isUserInOrg = async (
  orgID: string,
  userID: string
) => {
  const { data, error } = await supabase
    .from(TableName.orgMem)
    .select('id')
    .eq('org_id', orgID)
    .eq('user_id', userID)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
};

export const findRole = async ( 
  userID: string,
  defaultOrg: string 
) => {
  const { data, error } = await supabase
    .from(TableName.orgMem)
    .select('id, role')
    .eq('user_id', userID)
    .eq('org_id', defaultOrg)
    .limit(1)
    .single();

  if(!error) return data;

  throw new ErrorII(error.message);
}

/**
 * 
 * @param userID 
 * @param options 
 * @returns 
 */
export const findMembership = async (
  userID: string,
  paginate: boolean = false,
  options?: MembershipPagination
) => {
  const orderBy = options?.orderBy
    ? options.orderBy
    : 'org_id';

  const pageSize = options?.pageSize
    ? options.pageSize + 1
    : 10;

  // organization_members.org_id = organizations.id
  let slctStr = (`
    org_id,
    employee_code,
    status,
    organizations( org_name, icon, hex_color, status ),
    users(default_org)
  `);

  if (options?.withBranches) {
    // organization_members.id = branch_members.org_mem_id
    // branch_members.branch_id = branches-id
    slctStr += (`
      ,
      branch_members (
        branch_id,
        roles(role),
        status,
        starred,
        branches( branch_name, icon, color, status )
      )
    `);
  }

  let buidler = supabase 
    .from('organization_members')
    .select(slctStr)
    .eq('user_id', userID)
    .eq('organizations.status', 'active')
    .eq('status', 'accepted')
    .limit(pageSize)
    .order(orderBy, { ascending: options?.order === 'asc'});

  buidler = options?.withBranches === 'true'
    ? buidler.eq('branch_members.branches.status', 'active')
    : buidler;
  
  if (options?.defaultOrgOnly === 'true') {
    const userData = await supabase
      .from('users')
      .select('default_org')
      .eq('id', userID)
      .limit(1)
      .single();

    if (userData.data?.default_org) {
      buidler = buidler.eq('users.default_org', userData?.data?.default_org);
    } 
  } 

  if (options?.cursor) {
    buidler = handleCursor(
      options.cursor,
      buidler,
      orderBy,
      options.order
    );
  }

  const { data, error } = await buidler;
  
  if (error) {
    throw new RecordNotFound(
      'Failed to fetch organization list.'
    );
  }

  if (paginate) {
    return handleNextPage(
      data, 
      pageSize,
      orderBy
    );
  }

  return data;
}

export const findAllMembers = async ( 
  orgID: string,
  options: OrgPagination
) => {
  const orderBy = options.orderBy
    ? options.orderBy
    : 'id';

  let builder = supabase
    .from(TableName.orgMem)
    .select(`
      id,
      user_id,
      users(
        firstname,
        middlename,
        lastname, 
        suffix,
        house_number,
        street,
        barangay,
        city,
        province,
        region,
        birthdate,
        email
      ),
      status,
      employee_code,
      employment_date,
      updated_at
    `)
    .eq('org_id', orgID)
    .limit(options.pageSize + 1)
    .order(orderBy, { ascending: options.order === 'asc' });
  
  if (options.cursor) {
    builder = handleCursor(
      options.cursor,
      builder,
      orderBy,
      options.order
    );
  }

  const { data, error } = await builder;

  if (error) throw new ErrorII(error.message);

  return handleNextPage(
    data, 
    options.pageSize,
    orderBy
  );
}

/**
 * 
 * @param orgID 
 * @param userID 
 * @param inviteID 
 * @param employeeCode 
 * @param employmentDate 
 * @returns 
 */
export const store = async <K extends keyof MembershipSelect>(
  orgID: string,
  userID: string,
  status: string,
  ...selectFields: K[]
) => {   
  const slctStr = selectFields.join(", ");

  await findMembership(userID);

  const { data, error } = await supabase
    .from('organization_members')
    .upsert({
      'org_id': orgID,
      'user_id': userID,
      'role': 'member',
      'status': status
    }, {
      onConflict: 'user_id,org_id'
    })
    .select(slctStr);

  if (!error) return data;

  if (error.code === '23505') {
    throw new InvalidCredentials(
      'User is already a member of the organization.'
    );
  }

  throw new InvalidCredentials(
    'Failed to store organization membership.'
  );
}

/**
 * 
 * @param org 
 * @returns 
 */
export const update = async ( 
  orgMemID: string,
  orgID: string,
  org: MembershipUpdate
) => {
  org.updated_at = (new Date()).toISOString();

  const odata = sanitizeObject(org);

  const { data, error } = await supabase
    .from(TableName.orgMem)
    .update(odata)
    .eq('id', orgMemID)
    .eq('org_id', orgID)
    .select('*')
    .single();

  if (!error) return data;

  throw new ErrorII(error.message);
}

export const deleteMembership = async ( memberID: any ) => {
  if (typeof memberID !== 'string') {
    throw new InvalidCredentials(
      'Member ID must be a string.'
    );
  }

  const orgDB = new BaseRepository(TableName.orgMem);

  await orgDB.delete(memberID);
}
