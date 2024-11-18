import * as core from '@actions/core'
import { FileValidator } from '../src/fileValidator'
import * as main from '../src/main'

/**
 * Mock implementation of the FileValidator class
 */
jest.mock('../src/fileValidator')

// Mock GitHub Actions core function types
let mockGetInput: jest.SpiedFunction<typeof core.getInput>
let mockSetFailed: jest.SpiedFunction<typeof core.setFailed>
let mockSetOutput: jest.SpiedFunction<typeof core.setOutput>

/**
 * Test suite for the GitHub Action's main integration functionality
 */
describe('GitHub Action Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetInput = jest.spyOn(core, 'getInput').mockImplementation(() => '')
    mockSetFailed = jest.spyOn(core, 'setFailed').mockImplementation(() => {})
    mockSetOutput = jest.spyOn(core, 'setOutput').mockImplementation(() => {})
  })

  /**
   * Test case: Verifies that the action succeeds when all files are found
   */
  it('succeeds when FileValidator reports all files exist', async () => {
    mockGetInput.mockReturnValue('file1.txt,file2.txt')
    const mockValidator = jest.mocked(FileValidator)
    mockValidator.prototype.validateFiles.mockResolvedValue({
      exists: true,
      missingFiles: []
    })

    await main.run()

    expect(mockSetOutput).toHaveBeenCalledWith('exists', 'true')
    expect(mockSetFailed).not.toHaveBeenCalled()
  })

  /**
   * Test case: Verifies that the action fails appropriately when files are missing
   */
  it('fails when FileValidator reports missing files', async () => {
    mockGetInput.mockReturnValue('file1.txt,missing.txt')
    const mockValidator = jest.mocked(FileValidator)
    mockValidator.prototype.validateFiles.mockResolvedValue({
      exists: false,
      missingFiles: ['missing.txt']
    })

    await main.run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      'The following files do not exist: missing.txt'
    )
  })
})
