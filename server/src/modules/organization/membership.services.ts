import { supabase } from "@/config/db";
import { BaseRepository } from "../base/base.repository";
import { sanitizeObject } from "@/utils/data.helpers";
import { 
  MembershipSelect, 
  MembershipUpdate, 
  TableName 
} from "./organization.types";
import { 
  ErrorII, 
  InvalidCredentials, 
  RecordNotFound 
} from "@/errors";


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
  options?: {
    withBranches?: boolean,
    defaultOrgOnly?: boolean
  }
) => {
  // organization_members.org_id = organizations.id
  let slctStr = (`
    org_id,
    employee_code,
    status,
    organizations( org_name, icon, hex_color, status )
  `);

  if (options?.withBranches) {
    // organization_members.id = branch_members.org_mem_id
    // branch_members.branch_id = branches-id
    slctStr += (`
      ,
      branch_members (
        branch_id,
        role(role),
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
    .eq('status', 'accepted')
    .eq('organizations.status', 'active');

  buidler = options?.withBranches
    ? buidler.eq('branch_members.branches.status', 'accepted')
    : buidler;
  
  buidler = options?.defaultOrgOnly 
    ? buidler.eq('is_default_org', true)
    : buidler;

  const { data, error } = await buidler;
  
  if (!error) return data;
  
  throw new RecordNotFound(
    'Failed to fetch organization list.'
  );
}

export const findAllMembers = async ( 
  orgID: string 
) => {
  const { data, error } = await supabase
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
    .eq('org_id', orgID);
  
  if (!error) return data;

  throw new ErrorII(error.message);
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
