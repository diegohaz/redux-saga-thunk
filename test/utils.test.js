import {
  isAsyncAction,
  isAsyncRequestAction,
  getAsyncMeta,
  createAsyncAction,
  getAsyncName,
  hasKey,
  generateAsyncKey,
} from '../src/utils'

const action = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})

test('isAsyncAction', () => {
  expect(isAsyncAction(action())).toBe(false)
  expect(isAsyncAction(action({}))).toBe(false)
  expect(isAsyncAction(action({ async: {} }))).toBe(true)
  expect(isAsyncAction(action({ async: true }))).toBe(true)
})

test('isAsyncRequestAction', () => {
  expect(isAsyncRequestAction(action())).toBe(false)
  expect(isAsyncRequestAction(action({}))).toBe(false)
  expect(isAsyncRequestAction(action({ async: true }))).toBe(false)
  expect(isAsyncRequestAction(action({ async: 'FOO' }))).toBe(false)
  expect(isAsyncRequestAction(action({ async: 'FOO_1234567890123456' }))).toBe(false)
  expect(isAsyncRequestAction(action({ async: 'FOO_1234567890123456_REQUEST' }))).toBe(true)
})

test('getAsyncMeta', () => {
  expect(getAsyncMeta(action({}))).toBeNull()
  expect(getAsyncMeta(action({ async: true }))).toBe(true)
})

test('createAsyncAction', () => {
  expect(createAsyncAction({ type: 'FOO' }, 'foo')).toEqual({
    type: 'FOO',
    meta: {
      async: 'foo',
    },
  })
})

test('getAsyncName', () => {
  expect(getAsyncName({ type: 'FOO' })).toBe('FOO')
  expect(getAsyncName({
    type: 'FOO',
    meta: {},
  })).toBe('FOO')
  expect(getAsyncName({
    type: 'FOO',
    meta: {
      async: true,
    },
  })).toBe('FOO')
  expect(getAsyncName({
    type: 'FOO',
    meta: {
      async: 'BAR',
    },
  })).toBe('BAR')
  expect(getAsyncName({
    type: 'FOO',
    meta: {
      async: 'BAR_1234567890123456_REQUEST',
    },
  })).toBe('BAR')
  expect(getAsyncName({
    type: 'FOO',
    meta: {
      async: 'BAR_1234567890123456_RESPONSE',
    },
  })).toBe('BAR')
})

test('hasKey', () => {
  expect(hasKey({ type: 'FOO' })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {},
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      async: true,
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      async: 'FOO',
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      async: 'FOO_1234567890123456_REQUEST',
    },
  })).toBe(true)
})

test('hasKey', () => {
  expect(hasKey({ type: 'FOO' })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {},
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      async: true,
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      async: 'FOO',
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      async: 'FOO_1234567890123456_REQUEST',
    },
  })).toBe(true)
})

test('generateAsyncKey', () => {
  expect(generateAsyncKey({
    type: 'FOO',
    meta: {
      async: 'FOO',
    },
  })).toEqual(expect.stringMatching(/^FOO_\d{16}_REQUEST/))
  expect(generateAsyncKey({
    type: 'FOO',
  })).toEqual(expect.stringMatching(/^FOO_\d{16}_REQUEST/))
  expect(generateAsyncKey({
    type: 'FOO',
    meta: {
      async: 'FOO_1234567890123456_REQUEST',
    },
  })).toEqual(expect.stringMatching(/^FOO_1234567890123456_RESPONSE/))
})
