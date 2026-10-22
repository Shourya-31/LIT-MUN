import { describe, expect, it } from 'vitest';
import { applicationInputSchema } from '../src/modules/applications/applications.schemas.js';

const validApplication = {
  fullName: 'Delegate Example',
  email: 'delegate@example.edu',
  phone: '+91 98765 43210',
  institution: 'Example University',
  academicLevel: 'Undergraduate',
  city: 'Raipur',
  country: 'India',
  committees: [
    { committeeCode: 'UNSC', portfolios: ['France', 'Japan', 'India'] },
    { committeeCode: 'UNHRC', portfolios: [] },
    { committeeCode: 'AIPPM', portfolios: [] },
  ],
  experienceLevel: '1+',
  pastConferences: '',
  statementOfIntent: '',
  agreedToTerms: true,
};

describe('applicationInputSchema', () => {
  it('accepts the existing three-choice workflow with optional secondary preference groups', () => {
    expect(applicationInputSchema.safeParse(validApplication).success).toBe(true);
  });

  it('requires three primary portfolio preferences', () => {
    const invalid = structuredClone(validApplication);
    invalid.committees[0].portfolios = ['France'];
    expect(applicationInputSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects duplicate committee and portfolio selections', () => {
    const duplicateCommittee = structuredClone(validApplication);
    duplicateCommittee.committees[2].committeeCode = 'UNSC';
    expect(applicationInputSchema.safeParse(duplicateCommittee).success).toBe(false);

    const duplicatePortfolio = structuredClone(validApplication);
    duplicatePortfolio.committees[0].portfolios = ['France', 'France', 'India'];
    expect(applicationInputSchema.safeParse(duplicatePortfolio).success).toBe(false);
  });

  it('rejects partially completed secondary portfolio rankings', () => {
    const partialPreferences = structuredClone(validApplication);
    partialPreferences.committees[1].portfolios = ['Japan'];
    expect(applicationInputSchema.safeParse(partialPreferences).success).toBe(false);
  });
});
