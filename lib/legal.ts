/**
 * Single source of truth for the facts the Privacy Policy and Terms refer to.
 * Review these with the business owner (and a legal adviser) before launch.
 */
export const LEGAL = {
  brand: 'Stavarkling',
  /** Name of the legal person / business operating the site. Confirm and update. */
  entityName: 'Stavarkling',
  /** Optional. When set, shown as the postal address in both documents. */
  postalAddress: '',
  contactEmail: 'private@stavarkling.com',
  lastUpdated: '8 November 2026',
  /** Retention of application records after the last contact, in months. */
  applicationRetentionMonths: 24,
  verificationCodeMinutes: 10,
  accessSessionDays: 30,
} as const
