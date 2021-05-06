import * as core from '@actions/core'
import {
  EMAIL,
  API_TOKEN,
  SUBDOMAIN,
  RELEASE_NAME,
  PROJECT,
  CREATE,
  TICKETS,
  DRY_RUN
} from './env'
import {Project} from './api'
import {Version} from './models'

async function run(): Promise<void> {
  try {
    if (DRY_RUN === 'ci') {
      core.info(`email ${EMAIL}`)
      core.info(`project ${PROJECT}`)
      core.info(`subdomain ${SUBDOMAIN}`)
      core.info(`release ${RELEASE_NAME}`)
      core.info(`create ${CREATE}`)
      core.info(`tickets ${TICKETS}`)
      return
    }

    if (DRY_RUN === 'true') {
      core.info(`email ${EMAIL}`)
      core.info(`project ${PROJECT}`)
      core.info(`subdomain ${SUBDOMAIN}`)
      core.info(`release ${RELEASE_NAME}`)
      core.info(`create ${CREATE}`)
      core.info(`tickets ${TICKETS}`)
      const project = await Project.create(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)
      core.info(`Project loaded ${project.project?.id}`)
      const version = project.getVersion(RELEASE_NAME)

      if (version === undefined) {
        core.info(`Version ${RELEASE_NAME} not found`)
      } else {
        core.info(`Version ${RELEASE_NAME} found`)
      }
      return
    }

    const project = await Project.create(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)

    core.debug(`Project loaded ${project.project?.id}`)

    let version = project.getVersion(RELEASE_NAME)

    if (version === undefined) {
      core.debug(`Version ${RELEASE_NAME} not found`)
      if (CREATE === 'true') {
        core.debug(`Version ${RELEASE_NAME} is going to the created`)
        const versionToCreate: Version = {
          name: RELEASE_NAME,
          archived: false,
          released: true,
          releaseDate: new Date().toISOString(),
          projectId: Number(project.project?.id)
        }
        version = await project.createVersion(versionToCreate)
        core.debug(versionToCreate.name)
      }
    } else {
      core.debug(`Version ${RELEASE_NAME} found and is going to be updated`)
      const versionToUpdate: Version = {
        ...version,
        self: undefined,
        released: true,
        releaseDate: new Date().toISOString(),
        userReleaseDate: undefined
      }
      version = await project.updateVersion(versionToUpdate)
    }

    if (TICKETS !== '') {
      const tickets = TICKETS.split(',')
      // eslint-disable-next-line github/array-foreach
      tickets.forEach(ticket => {
        core.debug(`Going to update ticket ${ticket}`)
        if (version?.id !== undefined) project.updateIssue(ticket, version?.id)
      })
    }
  } catch (_e) {
    const e: Error = _e
    core.setFailed(e)
  }
}

run()
