import { info, setFailed } from '@actions/core'
import { EMAIL, API_TOKEN, SUBDOMAIN, RELEASE_NAME, PROJECT, CREATE, TICKETS, DRY_RUN, RELEASE } from './env'
import { API } from './api'
import * as DebugMessages from './constants/debug-messages'
import { CreateVersionParams, UpdateVersionParams } from './types'

const printConfiguration = (): void => {
  info(`
    CONFIGURED WITH OPTIONS:
      * email ${EMAIL}
      * project: ${PROJECT}
      * subdomain: ${SUBDOMAIN}
      * release: ${RELEASE_NAME}
      * create: ${CREATE}
      * tickets: ${TICKETS}
      * release: ${RELEASE}
  `)
}

async function run(): Promise<void> {
  try {
    if (DRY_RUN === 'ci') {
      printConfiguration()

      return
    }

    const api = new API(EMAIL, API_TOKEN, PROJECT, SUBDOMAIN)
    const project = await api.loadProject()
    info(DebugMessages.PROJECT_LOADED(project.id))

    if (DRY_RUN === 'true') {
      const version = project.versions.find((v) => v.name === RELEASE_NAME)

      if (version === undefined) {
        info(DebugMessages.VERSION_NOT_FOUND(RELEASE_NAME))
      } else {
        info(DebugMessages.VERSION_FOUND(RELEASE_NAME))
      }

      return
    }

    let version = project.versions.find((v) => v.name === RELEASE_NAME)
    const release = RELEASE === true

    if (version === undefined) {
      info(DebugMessages.VERSION_NOT_FOUND(RELEASE_NAME))

      if (CREATE === true) {
        info(DebugMessages.VERSION_WILL_BE_CREATED(RELEASE_NAME))

        const versionToCreate: CreateVersionParams = {
          name: RELEASE_NAME,
          released: release,
          projectId: Number(project.id),
          ...(release && { releaseDate: new Date().toISOString() })
        }

        version = await api.createVersion(versionToCreate)
      }
    } else {
      info(DebugMessages.VERSION_WILL_BE_UPDATED(RELEASE_NAME))

      const versionToUpdate: UpdateVersionParams = {
        released: release,
        releaseDate: new Date().toISOString()
      }
      version = await api.updateVersion(version.id, versionToUpdate)
    }

    if (TICKETS !== '') {
      const tickets = TICKETS.split(',')
      for (const ticket of tickets) {
        info(DebugMessages.UPDATING_TICKET(ticket))

        if (version?.id !== undefined) {
          api.updateIssue(ticket, version.id)
        }
      }
    }
  } catch (_e) {
    const e: Error = _e as Error
    setFailed(e)
  }
}

run()
