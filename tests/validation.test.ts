import { describe, expect, it } from 'vitest';
import { enquirySchema } from '../lib/server/validation';
describe('enquiry validation',()=>{it('normalizes a valid enquiry',()=>{const x=enquirySchema.parse({name:'  Ada  ',email:'ADA@EXAMPLE.COM ',phone:'+91 12345',requirement:'Need product documentation.',website:''});expect(x.email).toBe('ada@example.com');expect(x.name).toBe('Ada');});it('rejects incomplete enquiries',()=>expect(()=>enquirySchema.parse({name:'A',email:'bad',phone:'1',requirement:'short'})).toThrow());});
