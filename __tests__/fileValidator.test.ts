import * as core from '@actions/core'
import * as fs from 'fs/promises'
import { PathLike } from 'fs'
import { FileValidator } from '../src/fileValidator'

/**
 * Mock the file system promises module for controlled file existence testing
 */
jest.mock('fs/promises')

/**
 * @interface ValidateFilesResult
 * @property {boolean} exists - Indicates if all files exist
 * @property {string[]} missingFiles - Array of files that don't exist
 */

let mockDebug: jest.SpiedFunction<typeof core.debug>

/**
 * Test suite for the FileValidator class
 * Tests file existence validation functionality
 */
describe('FileValidator', () => {
  let fileValidator: FileValidator

  beforeEach(() => {
    jest.clearAllMocks()
    mockDebug = jest.spyOn(core, 'debug').mockImplementation(() => {})
    fileValidator = new FileValidator()
  })

  /**
   * Test case: Verifies successful validation when all specified files exist
   */
  it('should return success when all files exist', async () => {
    // Mock fs.access to simulate all files existing
    jest.spyOn(fs, 'access').mockResolvedValue(undefined)

    const result = await fileValidator.validateFiles('file1.txt,file2.txt')

    expect(result.exists).toBe(true)
    expect(result.missingFiles).toHaveLength(0)
    expect(mockDebug).toHaveBeenCalledWith('File exists: file1.txt')
    expect(mockDebug).toHaveBeenCalledWith('File exists: file2.txt')
  })

  /**
   * Test case: Verifies correct detection and reporting of missing files
   */
  it('should detect missing files', async () => {
    // Mock fs.access to simulate specific file not existing
    jest.spyOn(fs, 'access').mockImplementation(async (path: PathLike) => {
      if (path.toString().includes('missing.txt')) {
        throw new Error('ENOENT: File not found')
      }
      return Promise.resolve(undefined)
    })

    const result = await fileValidator.validateFiles('file1.txt,missing.txt')

    expect(result.exists).toBe(false)
    expect(result.missingFiles).toEqual(['missing.txt'])
  })
})
