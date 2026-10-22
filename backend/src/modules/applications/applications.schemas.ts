import { z } from 'zod';

const committeeChoiceSchema = z.object({
  committeeCode: z.string().trim().min(2).max(16),
  portfolios: z.array(z.string().trim().min(1).max(180)).max(3),
}).superRefine((choice, context) => {
  if (choice.portfolios.length !== 0 && choice.portfolios.length !== 3) {
    context.addIssue({
      code: 'custom',
      message: 'Each committee must have either zero or exactly three ranked portfolio preferences',
      path: ['portfolios'],
    });
  }
  if (new Set(choice.portfolios).size !== choice.portfolios.length) {
    context.addIssue({
      code: 'custom',
      message: 'Portfolio preferences must not contain duplicates',
      path: ['portfolios'],
    });
  }
});

export const applicationInputSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(5).max(40),
  institution: z.string().trim().min(2).max(200),
  academicLevel: z.enum(['High School', 'Undergraduate', 'Postgraduate', 'Independent']),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  committees: z.array(committeeChoiceSchema).length(3),
  experienceLevel: z.enum(['0 (First Conference)', '1+', '5+', '10+', '15+', '50+']),
  pastConferences: z.string().trim().max(2000).optional().default(''),
  statementOfIntent: z.string().trim().max(4000).optional().default(''),
  agreedToTerms: z.literal(true),
}).superRefine((input, context) => {
  const codes = input.committees.map((choice) => choice.committeeCode);
  if (input.committees[0]?.portfolios.length !== 3) {
    context.addIssue({
      code: 'custom',
      message: 'The first committee choice must have exactly three portfolio preferences',
      path: ['committees', 0, 'portfolios'],
    });
  }
  if (new Set(codes).size !== codes.length) {
    context.addIssue({
      code: 'custom',
      message: 'Each committee may only be selected once',
      path: ['committees'],
    });
  }
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;
