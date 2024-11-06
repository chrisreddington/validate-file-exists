import * as core from '@actions/core'
import * as fs from 'fs/promises'
import { PathLike } from 'fs'
import * as main from '../src/main'

// Mocks
jest.mock('fs/promises')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('file checker action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    debugMock = jest.spyOn(core, 'debug').mockImplementation(() => {})
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation(() => '')
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation(() => {})
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation(() => {})
  })

  it('succeeds when all files exist', async () => {
    getInputMock.mockReturnValue('file1.txt,file2.txt')
    // Mock fs.access to resolve successfully
    jest.spyOn(fs, 'access').mockResolvedValue(undefined)

    await main.run()

    expect(debugMock).toHaveBeenCalledWith('File exists: file1.txt')
    expect(debugMock).toHaveBeenCalledWith('File exists: file2.txt')
    expect(setOutputMock).toHaveBeenCalledWith('exists', 'true')
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  it('fails when files are missing', async () => {
    getInputMock.mockReturnValue('file1.txt,missing.txt')
    // Mock fs.access to fail for missing.txt
    jest.spyOn(fs, 'access').mockImplementation(async (path: PathLike) => {
      if (path.toString().includes('missing.txt')) {
        return Promise.reject(new Error('File not found'))
      }
      return Promise.resolve(undefined)
    })

    await main.run()

    expect(setFailedMock).toHaveBeenCalledWith(
      'The following files do not exist: missing.txt'
    )
  })
})
