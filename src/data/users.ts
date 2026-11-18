/**
 * Demo accounts published on saucedemo.com's login page.
 * They are public practice credentials, not secrets; the password can still be
 * overridden through the SAUCE_PASSWORD environment variable.
 */
export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;

export const CUSTOMER = {
  firstName: 'Asha',
  lastName: 'Tester',
  postalCode: '560001',
};
