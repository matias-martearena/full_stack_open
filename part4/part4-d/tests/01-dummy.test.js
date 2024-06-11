import { test, describe } from 'node:test'
import assert from 'node:assert'

import { dummy } from '../utils/list_helper.js'

describe('list', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = dummy(blogs)
    assert.strictEqual(result, 1)
  })
})
