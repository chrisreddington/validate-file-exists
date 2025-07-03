import * as fs from 'fs/promises'
import * as path from 'path'
import * as core from '@actions/core'
import { FileValidationResult } from './types'

export class FileValidator {
  /**
   * Validates if the specified files exist
   * @param files Comma-separated list of files to check
   * @returns Promise<FileValidationResult>
   */
  async validateFiles(files: string): Promise<FileValidationResult> {
    // Validate input is not empty or whitespace-only
    if (!files || files.trim().length === 0) {
      throw new Error(
        'Input cannot be empty. Please provide a comma-separated list of files to validate.'
      )
    }

    const fileList = files
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    // Validate that we have actual files after splitting and trimming
    if (fileList.length === 0) {
      throw new Error(
        'No valid files found in input. Please provide a comma-separated list of file names.'
      )
    }

    const missingFiles: string[] = []

    for (const file of fileList) {
      const fullPath = path.resolve(file)
      try {
        await fs.access(fullPath)
        core.debug(`File exists: ${file}`)
      } catch {
        core.debug(`File does not exist: ${file}`)
        missingFiles.push(file)
      }
    }

    return {
      exists: missingFiles.length === 0,
      missingFiles
    }
  }
}
