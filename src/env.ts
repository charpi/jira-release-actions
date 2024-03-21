import { getInput, getBooleanInput } from '@actions/core'

// Jira API credentials
export const EMAIL: string = getInput('jira_user_email', { required: true })
export const API_TOKEN: string = getInput('jira_api_token', { required: true })
export const SUBDOMAIN: string = getInput('jira_base_url', { required: true })

// Release information
export const RELEASE_NAME: string = getInput('release_name', { required: true })
export const TIME_ZONE: string = getInput('time_zone', { required: false })
export const PROJECT: string = getInput('jira_project', { required: true })
export const TICKETS: string = getInput('tickets', { required: false })

// Github actions
export const DRY_RUN: string = getInput('dry_run', { required: false })
export const CREATE: boolean = getBooleanInput('create', { required: false })
export const RELEASE: boolean = getBooleanInput('release', { required: false })
export const ARCHIVE: boolean = getBooleanInput('archive', { required: false })
