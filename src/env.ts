import { getInput, getBooleanInput } from '@actions/core'

// Jira API credentials
export const EMAIL: string = getInput('email', { required: true })
export const API_TOKEN: string = getInput('api_token', { required: true })
export const SUBDOMAIN: string = getInput('subdomain', { required: true })

// Release information
export const RELEASE_NAME: string = getInput('release_name', { required: true })
export const PROJECT: string = getInput('jira_project', { required: true })
export const TICKETS: string = getInput('tickets', { required: false })

// Github actions
export const DRY_RUN: string = getInput('dry_run', { required: false })
export const CREATE: boolean = getBooleanInput('create', { required: false })
export const RELEASE: boolean = getBooleanInput('release', { required: false })
