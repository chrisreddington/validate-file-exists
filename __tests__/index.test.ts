/**
 * Unit tests for the action's entrypoint (src/index.ts)
 */

import * as main from '../src/main'

/**
 * Mock implementation of the main run function
 */
const mockRun = jest.spyOn(main, 'run').mockImplementation()

/**
 * Test suite for the action's entry point
 */
describe('index', () => {
  /**
   * Test case: Verifies that the run function is called when the index is imported
   */
  it('calls run when imported', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')

    expect(mockRun).toHaveBeenCalled()
  })
})
