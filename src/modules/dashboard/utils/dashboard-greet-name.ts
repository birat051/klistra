/**
 * First name (or first token) for dashboard greeting copy, with a soft fallback.
 */
export function dashboardGreetFirstName(displayName: string): string {
  const part = displayName.trim().split(/\s+/)[0]
  return part || displayName || 'there'
}
