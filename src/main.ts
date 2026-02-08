import * as core from '@actions/core'
import { FileValidator } from './fileValidator.js'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const files: string = core.getInput('required-files', { required: true })
    const validator = new FileValidator()
    const result = await validator.validateFiles(files)

    if (!result.exists) {
      throw new Error(
        `The following files do not exist: ${result.missingFiles.join(', ')}`
      )
    }

    core.setOutput('exists', 'true')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
