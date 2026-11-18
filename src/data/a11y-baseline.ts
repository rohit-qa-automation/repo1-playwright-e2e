/**
 * Accessibility issues that already exist on the demo site, by axe rule id.
 * They are reported in every run but do not fail the build; anything new does.
 * In a client project this list is the "accessibility debt" backlog.
 */
export const KNOWN_A11Y_ISSUES: Record<string, string[]> = {
  login: [],
  inventory: [],
  cart: [],
};
