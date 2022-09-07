export const VERSION_NOT_FOUND = (version: string): string => `Version ${version} not found`
export const VERSION_FOUND = (version: string): string => `Version ${version} found`
export const VERSION_WILL_BE_CREATED = (version: string): string => `Version ${version} is going to the created`
export const VERSION_WILL_BE_UPDATED = (version: string): string =>
  `Version ${version} found and is going to be updated`
export const PROJECT_LOADED = (project_id: string): string => `Project loaded ${project_id}`
export const UPDATING_TICKET = (ticket_id: string): string => `Going to update ticket ${ticket_id}`
