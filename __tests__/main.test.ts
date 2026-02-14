import * as core from '@actions/core'
import { FileValidator } from '../src/fileValidator.js'
import { run } from '../src/main.js'
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest'

/**
 * Mock implementation of the FileValidator class
 */
vi.mock('../src/fileValidator.js')

/**
 * Mock @actions/core (ESM-only in v3, cannot use vi.spyOn)
 */
vi.mock('@actions/core')

// Mock GitHub Actions core function types
let mockGetInput: Mock
let mockSetFailed: Mock
let mockSetOutput: Mock

/**
 * Test suite for the GitHub Action's main integration functionality
 */
describe('GitHub Action Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetInput = vi.mocked(core.getInput).mockImplementation(() => '')
    mockSetFailed = vi.mocked(core.setFailed).mockImplementation(() => {})
    mockSetOutput = vi.mocked(core.setOutput).mockImplementation(() => {})
  })

  /**
   * Test case: Verifies that the action succeeds when all files are found
   */
  it('succeeds when FileValidator reports all files exist', async () => {
    mockGetInput.mockReturnValue('file1.txt,file2.txt')
    const mockValidator = vi.mocked(FileValidator, true)
    mockValidator.prototype.validateFiles.mockResolvedValue({
      exists: true,
      missingFiles: []
    })

    await run()

    expect(mockSetOutput).toHaveBeenCalledWith('exists', 'true')
    expect(mockSetFailed).not.toHaveBeenCalled()
  })

  /**
   * Test case: Verifies that the action fails appropriately when files are missing
   */
  it('fails when FileValidator reports missing files', async () => {
    mockGetInput.mockReturnValue('file1.txt,missing.txt')
    const mockValidator = vi.mocked(FileValidator, true)
    mockValidator.prototype.validateFiles.mockResolvedValue({
      exists: false,
      missingFiles: ['missing.txt']
    })

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      'The following files do not exist: missing.txt'
    )
  })

  /**
   * Test case: Verifies that validation errors are properly handled
   */
  it('fails when FileValidator throws validation error for empty input', async () => {
    mockGetInput.mockReturnValue('')
    const mockValidator = vi.mocked(FileValidator, true)
    mockValidator.prototype.validateFiles.mockRejectedValue(
      new Error(
        'Input cannot be empty. Please provide a comma-separated list of files to validate.'
      )
    )

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      'Input cannot be empty. Please provide a comma-separated list of files to validate.'
    )
    expect(mockSetOutput).not.toHaveBeenCalled()
  })

  /**
   * Test case: Verifies that validation errors are properly handled for invalid input
   */
  it('fails when FileValidator throws validation error for invalid input', async () => {
    mockGetInput.mockReturnValue(',,')
    const mockValidator = vi.mocked(FileValidator, true)
    mockValidator.prototype.validateFiles.mockRejectedValue(
      new Error(
        'No valid files found in input. Please provide a comma-separated list of file names.'
      )
    )

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      'No valid files found in input. Please provide a comma-separated list of file names.'
    )
    expect(mockSetOutput).not.toHaveBeenCalled()
  })
})
