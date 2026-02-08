import * as core from '@actions/core'
import * as fs from 'fs/promises'
import { PathLike } from 'fs'
import { FileValidator } from '../src/fileValidator.js'
import { vi, describe, it, expect, beforeEach, type MockInstance } from 'vitest'

/**
 * Mock the file system promises module for controlled file existence testing
 */
vi.mock('fs/promises')

/**
 * @interface ValidateFilesResult
 * @property {boolean} exists - Indicates if all files exist
 * @property {string[]} missingFiles - Array of files that don't exist
 */

let mockDebug: MockInstance<typeof core.debug>

/**
 * Test suite for the FileValidator class
 * Tests file existence validation functionality
 */
describe('FileValidator', () => {
  let fileValidator: FileValidator

  beforeEach(() => {
    vi.clearAllMocks()
    mockDebug = vi.spyOn(core, 'debug').mockImplementation(() => {})
    fileValidator = new FileValidator()
  })

  /**
   * Test case: Verifies successful validation when all specified files exist
   */
  it('should return success when all files exist', async () => {
    // Mock fs.access to simulate all files existing
    vi.spyOn(fs, 'access').mockResolvedValue(undefined)

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
    vi.spyOn(fs, 'access').mockImplementation(async (path: PathLike) => {
      if (path.toString().includes('missing.txt')) {
        throw new Error('ENOENT: File not found')
      }
      return Promise.resolve(undefined)
    })

    const result = await fileValidator.validateFiles('file1.txt,missing.txt')

    expect(result.exists).toBe(false)
    expect(result.missingFiles).toEqual(['missing.txt'])
  })

  /**
   * Test case: Verifies that empty input throws appropriate error
   */
  it('should throw error for empty input', async () => {
    await expect(fileValidator.validateFiles('')).rejects.toThrow(
      'Input cannot be empty. Please provide a comma-separated list of files to validate.'
    )
  })

  /**
   * Test case: Verifies that whitespace-only input throws appropriate error
   */
  it('should throw error for whitespace-only input', async () => {
    await expect(fileValidator.validateFiles('   ')).rejects.toThrow(
      'Input cannot be empty. Please provide a comma-separated list of files to validate.'
    )
  })

  /**
   * Test case: Verifies that input with only commas throws appropriate error
   */
  it('should throw error for input with only commas', async () => {
    await expect(fileValidator.validateFiles(',,,')).rejects.toThrow(
      'No valid files found in input. Please provide a comma-separated list of file names.'
    )
  })

  /**
   * Test case: Verifies that input with commas and whitespace throws appropriate error
   */
  it('should throw error for input with only commas and whitespace', async () => {
    await expect(fileValidator.validateFiles(' , , ')).rejects.toThrow(
      'No valid files found in input. Please provide a comma-separated list of file names.'
    )
  })

  /**
   * Test case: Verifies that files with extra whitespace are handled correctly
   */
  it('should handle files with extra whitespace', async () => {
    vi.spyOn(fs, 'access').mockResolvedValue(undefined)

    const result = await fileValidator.validateFiles(' file1.txt , file2.txt ')

    expect(result.exists).toBe(true)
    expect(result.missingFiles).toHaveLength(0)
    expect(mockDebug).toHaveBeenCalledWith('File exists: file1.txt')
    expect(mockDebug).toHaveBeenCalledWith('File exists: file2.txt')
  })

  /**
   * Test case: Verifies that mixed valid and empty entries are handled correctly
   */
  it('should filter out empty entries from comma-separated list', async () => {
    vi.spyOn(fs, 'access').mockResolvedValue(undefined)

    const result = await fileValidator.validateFiles(
      'file1.txt,,file2.txt, ,file3.txt'
    )

    expect(result.exists).toBe(true)
    expect(result.missingFiles).toHaveLength(0)
    expect(mockDebug).toHaveBeenCalledWith('File exists: file1.txt')
    expect(mockDebug).toHaveBeenCalledWith('File exists: file2.txt')
    expect(mockDebug).toHaveBeenCalledWith('File exists: file3.txt')
    expect(mockDebug).toHaveBeenCalledTimes(3) // Should only call for valid files
  })
})
