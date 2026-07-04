
export interface MemberInsert {
  branch_id: string;
  org_mem_id: string;
  role_id: string;
  status: string;
}

export interface MemberUpdate {
  role_id?: string;
  status?: string;
  starred?: boolean;
}

export interface BranchInsert {
  branch_name: string;
  icon?: string;
  color?: string;
  address?: string;
}

export interface BranchUpdate {
  branch_name?: string;
  icon?: string;
  color?: string;
  status?: string;
  address?: string;
}