import { info, debug, setFailed } from '@actions/core'
import { EMAIL, API_TOKEN, SUBDOMAIN, RELEASE_NAME, PROJECT, CREATE, TICKETS, DRY_RUN, RELEASE } from './env'
import { Project } from './api'
import { Version } from './models'

async function run(): Promise<void> {
  try {
    if (DRY_RUN === 'ci') {
      info(`email ${EMAIL}`)
      info(`project ${PROJECT}`)
      info(`subdomain ${SUBDOMAIN}`)
      info(`release ${RELEASE_NAME}`)
      info(`create ${CREATE}`)
      info(`tickets ${TICKETS}`)
      info(`release ${RELEASE}`)

      return
    }

    if (DRY_RUN === 'true') {
      info(`email ${EMAIL}`)
      info(`project ${PROJECT}`)
      info(`subdomain ${SUBDOMAIN}`)
      info(`release ${RELEASE_NAME}`)
      info(`create ${CREATE}`)
      info(`tickets ${TICKETS}`)
      info(`release ${RELEASE}`)

      const project = await Project.create(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)
      info(`Project loaded ${project.project?.id}`)

      const version = project.getVersion(RELEASE_NAME)

      if (version === undefined) {
        info(`Version ${RELEASE_NAME} not found`)
      } else {
        info(`Version ${RELEASE_NAME} found`)
      }

      return
    }

    const project = await Project.create(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)

    debug(`Project loaded ${project.project?.id}`)

    let version = project.getVersion(RELEASE_NAME)
    const release = RELEASE === true

    if (version === undefined) {
      debug(`Version ${RELEASE_NAME} not found`)

      if (CREATE === true) {
        debug(`Version ${RELEASE_NAME} is going to the created`)

        const versionToCreate: Version = {
          name: RELEASE_NAME,
          archived: false,
          released: release,
          releaseDate: new Date().toISOString(),
          projectId: Number(project.project?.id)
        }

        version = await project.createVersion(versionToCreate)
        debug(versionToCreate.name)
      }
    } else {
      debug(`Version ${RELEASE_NAME} found and is going to be updated`)

      const versionToUpdate: Version = {
        ...version,
        self: undefined,
        released: release,
        releaseDate: new Date().toISOString(),
        userReleaseDate: undefined
      }
      version = await project.updateVersion(versionToUpdate)
    }

    if (TICKETS !== '') {
      const tickets = TICKETS.split(',')
      // eslint-disable-next-line github/array-foreach
      tickets.forEach((ticket) => {
        debug(`Going to update ticket ${ticket}`)
        if (version?.id !== undefined) project.updateIssue(ticket, version?.id)
      })
    }
  } catch (_e) {
    const e: Error = _e as Error
    setFailed(e)
  }
}

run()
