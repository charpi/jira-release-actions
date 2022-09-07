import { debug } from '@actions/core'
import axios from 'axios'
import { CreateVersionParams, JiraProject, JiraVersion, UpdateVersionParams } from './types'
import { toMoreDescriptiveError } from './utils'

export class API {
  email: string
  token: string
  name: string
  domain: string
  project?: JiraProject

  constructor(email: string, token: string, name: string, domain: string) {
    this.email = email
    this.token = token
    this.name = name
    this.domain = domain
  }

  async createVersion(body: CreateVersionParams): Promise<JiraVersion> {
    try {
      const response = await axios.post<JiraVersion>(`https://${this.domain}.atlassian.net/rest/api/3/version`, body, {
        headers: this._headers()
      })

      return response.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  async updateVersion(id: string, body: UpdateVersionParams): Promise<JiraVersion> {
    try {
      debug(JSON.stringify(body))

      const response = await axios.put<JiraVersion>(
        `https://${this.domain}.atlassian.net/rest/api/3/version/${id}`,
        body,
        { headers: this._headers() }
      )

      return response.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateIssue(ticket_id: string, version_id: string): Promise<any> {
    try {
      const response = await axios.put(
        `https://${this.domain}.atlassian.net/rest/api/3/issue/${ticket_id}`,
        {
          update: {
            fixVersions: [
              {
                add: { id: version_id }
              }
            ]
          }
        },
        { headers: this._headers() }
      )

      return response.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  async loadProject(): Promise<JiraProject> {
    try {
      const response = await axios.get<JiraProject>(
        `https://${this.domain}.atlassian.net/rest/api/3/project/${this.name}?properties=versions,key,id,name`,
        { headers: this._headers() }
      )

      return response.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  _headers(): { Authorization: string; Accept: string; 'Content-Type': string } {
    return {
      Authorization: `Basic ${Buffer.from(`${this.email}:${this.token}`).toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
}
