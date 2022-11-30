// projects
export const PROJECT_LOADED = (project_id: string): string => `Project loaded ${project_id}`

// versions
export const VERSION_NOT_FOUND = (name: string): string => `Version ${name} not found`
export const VERSION_FOUND = (name: string): string => `Version ${name} found`
export const VERSION_WILL_BE_CREATED = (name: string): string => `Version ${name} is going to the created`
export const VERSION_WILL_BE_UPDATED = (name: string): string => `Version ${name} found and is going to be updated`
export const VERSION_WILL_BE_ARCHIVED = (name: string): string => `Version ${name} found and is going to be archived`
export const VERSION_CREATED = (name: string): string => `Version ${name} was successfully created`
export const VERSION_UPDATED = (name: string): string => `Version ${name} was successfully updated`
// tickets
export const UPDATING_TICKET = (ticket_id: string): string => `Going to update ticket ${ticket_id}`
export const TICKET_UPDATED = (ticket_id: string, version: string): string =>
  `(${version}) Ticket [${ticket_id}] was successfully updated`
