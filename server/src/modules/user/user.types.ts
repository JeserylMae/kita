
export type PermissionInfo = {
  role: string;
  scope: string;
};

export interface UserSelect {
  id?: string;
  auth_id?: string;
  
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;

  house_number?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  region?: string;

  birthdate?: Date;

  email?: string;
  password?: string;

  default_org?: string;

  updated_at?: Date;
  verified_at?: Date;
}


export interface UserInsert {  
  auth_id: string;

  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;

  house_number?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  region?: string;

  birthdate?: Date;

  email: string;
  password: string;
}

export interface UserUpdate {
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;

  house_number?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  region?: string;

  birthdate?: Date;

  email?: string;
  password?: string;

  default_org?: string;
  
  verified_at?: Date;
}