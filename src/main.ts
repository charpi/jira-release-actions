import { info, setFailed } from '@actions/core'
import { EMAIL, API_TOKEN, SUBDOMAIN, RELEASE_NAME, PROJECT, CREATE, TICKETS, DRY_RUN, RELEASE, ARCHIVE } from './env'
import { API } from './api'
import * as DebugMessages from './constants/debug-messages'
import { CreateVersionParams, UpdateVersionParams } from './types'

const printConfiguration = (): void => {
  info(`
    CONFIGURED WITH OPTIONS:
      * email ${EMAIL}
      * project: ${PROJECT}
      * subdomain: ${SUBDOMAIN}
      * release_name: ${RELEASE_NAME}
      * create: ${CREATE}
      * tickets: ${TICKETS}
      * release: ${RELEASE}
      * archive: ${ARCHIVE}
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
    const archive = ARCHIVE === true

    if (version === undefined) {
      // Create new release and ignore ARCHIVE value, release date will use Australia/Melbourne timezone
      info(DebugMessages.VERSION_NOT_FOUND(RELEASE_NAME))

      if (CREATE) {
        info(DebugMessages.VERSION_WILL_BE_CREATED(RELEASE_NAME))

        const versionToCreate: CreateVersionParams = {
          name: RELEASE_NAME,
          released: release === true && archive !== true,
          projectId: Number(project.id),
          ...(release && { releaseDate: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString() }),
          archived: false
        }

        version = await api.createVersion(versionToCreate)
        info(DebugMessages.VERSION_CREATED(RELEASE_NAME))
      }
    } else {
      // update release and ignore ARCHIVE value
      info(DebugMessages.VERSION_WILL_BE_UPDATED(RELEASE_NAME))

      const versionToUpdate: UpdateVersionParams = {
        released: release,
        ...(release && { releaseDate: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString() }),
        archived: false
      }
      version = await api.updateVersion(version.id, versionToUpdate)
      info(DebugMessages.VERSION_UPDATED(RELEASE_NAME))
    }

    // Assign JIRA issues to Release
    if (TICKETS !== '') {
      const tickets = TICKETS.split(',')

      for (const ticket of tickets) {
        info(DebugMessages.UPDATING_TICKET(ticket))

        if (version?.id !== undefined) {
          await api.updateIssue(ticket, version.id)
          info(DebugMessages.TICKET_UPDATED(ticket, version.id))
        }
      }
    }

    // Now let's do the ARCHIVE business
    if (archive) {
      info(DebugMessages.VERSION_WILL_BE_ARCHIVED(RELEASE_NAME))

      // if archive then we ignore release value
      const versionToUpdate: UpdateVersionParams = {
        released: false,
        releaseDate: undefined,
        archived: archive
      }
      if (version?.id !== undefined) {
        version = await api.updateVersion(version.id, versionToUpdate)
        info(DebugMessages.VERSION_UPDATED(RELEASE_NAME))
      }
    }
  } catch (_e) {
    const e: Error = _e as Error
    setFailed(e)
  }
}

run()
