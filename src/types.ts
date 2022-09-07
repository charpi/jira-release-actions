export type JiraVersion = {
  self: string
  id: string
  name: string
  archived: boolean
  released: boolean
  releaseDate?: string
  userReleaseDate?: string
  projectId: number
}

export type JiraProject = {
  self: string
  id: string
  key: string
  name: string
  versions: JiraVersion[]
}

export type UpdateVersionParams = {
  released: boolean
  releaseDate: string
}

export type CreateVersionParams = {
  name: string
  released: boolean
  projectId: number
  releaseDate?: string | undefined
}

export type ErrorResponse = {
  errorMessages: string[]
  errors: {
    [key: string]: string
  }
  status: number
}
