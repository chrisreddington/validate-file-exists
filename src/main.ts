import * as core from '@actions/core'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const files: string = core.getInput('required-files', { required: true })
    const fileList = files.split(',').map(f => f.trim())
    const missingFiles: string[] = []

    // Check each file
    for (const file of fileList) {
      const fullPath = path.resolve(file)
      try {
        await fs.access(fullPath)
        core.debug(`File exists: ${file}`)
      } catch {
        missingFiles.push(file)
      }
    }

    // Handle results
    if (missingFiles.length > 0) {
      throw new Error(
        `The following files do not exist: ${missingFiles.join(', ')}`
      )
    }

    core.setOutput('exists', 'true')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
