import * as z from 'zod';

import { 
  ReferenceTypeSchema,
  ReferenceID
} from '../common/inventory.schemas'

import { 
  Amount, 
  PaymentMethod 
} from '../common/inventory.schemas';

import {
  BranchID,
  CreatedByName,
  CreatedByRole,
  UUID,
} from '../../base/base.schemas'


export const QueryParamsSchema = z.object({
  id: UUID,
  referenceType: ReferenceTypeSchema
});

const TransactionCode = z.string().meta({
  description: "Unique code for the transaction",
  example: "TXN-00123",
});

export const TransactionInsertSchema = z.object({
  branch_id:       BranchID,
  amount:          Amount,
  payment_method:  PaymentMethod,
  reference_type:  ReferenceTypeSchema,
  reference_id:    ReferenceID,
  code:            TransactionCode,
  created_by_name: CreatedByName.optional().nullable(),
  created_by_role: CreatedByRole.optional().nullable()
});

export const TransactionUpdateSchema = z.object({
  amount:          Amount.optional().nullable(),
  payment_method:  PaymentMethod.optional().nullable(),
  reference_type:  ReferenceTypeSchema.optional().nullable(),
  reference_id:    ReferenceID.optional().nullable(),
  code:            TransactionCode.optional().nullable(),
  created_by_name: CreatedByName.optional().nullable(),
  created_by_role: CreatedByRole.optional().nullable()
});
