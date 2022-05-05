import * as core from '@actions/core'

export const EMAIL: string = core.getInput('email', {required: true})
export const API_TOKEN: string = core.getInput('api_token', {required: true})
export const SUBDOMAIN: string = core.getInput('subdomain', {required: true})

export const RELEASE_NAME: string = core.getInput('release_name', {
  required: true
})
export const PROJECT: string = core.getInput('jira_project', {required: true})
export const CREATE: string = core.getInput('create', {required: false})
export const RELEASED: string = core.getInput('released', {required: false})
export const TICKETS: string = core.getInput('tickets', {required: false})
export const DRY_RUN: string = core.getInput('dry_run', {required: false})
