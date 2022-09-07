import { info, debug, setFailed } from '@actions/core'
import { EMAIL, API_TOKEN, SUBDOMAIN, RELEASE_NAME, PROJECT, CREATE, TICKETS, DRY_RUN, RELEASE } from './env'
import { API } from './api'
import * as DebugMessages from './constants/debug-messages'
import { CreateVersionParams, UpdateVersionParams } from './types'

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

      const api = new API(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)
      const project = await api.loadProject()
      info(DebugMessages.PROJECT_LOADED(project.id))

      const version = project.versions.find((v) => v.name === RELEASE_NAME)

      if (version === undefined) {
        info(DebugMessages.VERSION_NOT_FOUND(RELEASE_NAME))
      } else {
        info(DebugMessages.VERSION_FOUND(RELEASE_NAME))
      }

      return
    }

    const api = new API(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)
    const project = await api.loadProject()

    debug(DebugMessages.PROJECT_LOADED(project.id))

    let version = project.versions.find((v) => v.name === RELEASE_NAME)
    const release = RELEASE === true

    if (version === undefined) {
      debug(DebugMessages.VERSION_NOT_FOUND(RELEASE_NAME))

      if (CREATE === true) {
        debug(DebugMessages.VERSION_WILL_BE_CREATED(RELEASE_NAME))

        const versionToCreate: CreateVersionParams = {
          name: RELEASE_NAME,
          released: release,
          projectId: Number(project.id),
          ...(release && { releaseDate: new Date().toISOString() })
        }

        version = await api.createVersion(versionToCreate)
        debug(versionToCreate.name)
      }
    } else {
      debug(DebugMessages.VERSION_WILL_BE_UPDATED(RELEASE_NAME))

      const versionToUpdate: UpdateVersionParams = {
        released: release,
        releaseDate: new Date().toISOString()
      }
      version = await api.updateVersion(version.id, versionToUpdate)
    }

    if (TICKETS !== '') {
      const tickets = TICKETS.split(',')
      for (const ticket of tickets) {
        debug(DebugMessages.UPDATING_TICKET(ticket))
        if (version?.id !== undefined) {
          api.updateIssue(ticket, version?.id)
        }
      }
    }
  } catch (_e) {
    const e: Error = _e as Error
    setFailed(e)
  }
}

run()
