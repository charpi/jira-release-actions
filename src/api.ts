import { debug } from '@actions/core'
import axios, { AxiosError } from 'axios'
import { Version, ProjectDTO } from './models'

export class Project {
  email: string
  token: string
  name: string
  domain: string

  project?: ProjectDTO

  constructor(email: string, token: string, name: string, domain: string) {
    this.email = email
    this.token = token
    this.name = name
    this.domain = domain
  }

  getVersion(rel: string): Version | undefined {
    if (this.project === undefined) return undefined
    else {
      const result = this.project.versions?.filter((i) => i.name === rel)
      if (result === undefined) return undefined
      if (result.length === 0) {
        return undefined
      } else return result[0]
    }
  }

  async createVersion(version: Version): Promise<Version> {
    try {
      const response = await axios.post(
        `https://${this.domain}.atlassian.net/rest/api/3/version`,
        version,
        this._authHeaders()
      )
      return response?.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  async updateVersion(version: Version): Promise<Version> {
    try {
      debug(JSON.stringify(version))
      const response = await axios.put(
        `https://${this.domain}.atlassian.net/rest/api/3/version/${version.id}`,
        version,
        this._authHeaders()
      )
      return response?.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async updateIssue(ticket: string, version: string) {
    try {
      const response = await axios.put(
        `https://${this.domain}.atlassian.net/rest/api/3/issue/${ticket}`,
        {
          update: {
            fixVersions: [
              {
                add: { id: version }
              }
            ]
          }
        },
        this._authHeaders()
      )
      return response?.data
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  static async create(email: string, token: string, name: string, domain: string): Promise<Project> {
    const result = new Project(email, token, name, domain)
    return result._load()
  }

  async _load(): Promise<Project> {
    try {
      const response = await axios.get(
        `https://${this.domain}.atlassian.net/rest/api/3/project/${this.name}?properties=versions,key,id,name`,
        this._authHeaders()
      )
      this.project = response?.data
      return this
    } catch (error: unknown) {
      return Promise.reject(toMoreDescriptiveError(error))
    }
  }

  _authHeaders(): Object {
    return {
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.email}:${this.token}`).toString('base64')}`,
        Accept: 'application/json'
      }
    }
  }
}

const toMoreDescriptiveError = (error: unknown): Error | unknown => {
  if (isAxiosError(error) && error.response?.status === 404 && Array.isArray(error.response.data?.errorMessages)) {
    return new Error(`${error.response.data?.errorMessages[0]} (this may be due to a missing/invalid API key)`)
  } else {
    debug(`error: ${error}`)
    return error
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAxiosError = (error: any): error is AxiosError => error?.isAxiosError ?? false
