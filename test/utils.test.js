import {
  isThunkAction,
  isThunkRequestAction,
  getThunkMeta,
  createThunkAction,
  getThunkName,
  hasKey,
  generateThunkKey,
} from '../src/utils'

const action = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})

test('isThunkAction', () => {
  expect(isThunkAction(action())).toBe(false)
  expect(isThunkAction(action({}))).toBe(false)
  expect(isThunkAction(action({ thunk: {} }))).toBe(true)
  expect(isThunkAction(action({ thunk: { id: 1 } }))).toBe(true)
  expect(isThunkAction(action({ thunk: true }))).toBe(true)
})

test('isThunkRequestAction', () => {
  expect(isThunkRequestAction(action())).toBe(false)
  expect(isThunkRequestAction(action({}))).toBe(false)
  expect(isThunkRequestAction(action({ thunk: true }))).toBe(false)
  expect(isThunkRequestAction(action({ thunk: { id: 1 } }))).toBe(false)
  expect(isThunkRequestAction(action({ thunk: 'FOO' }))).toBe(false)
  expect(isThunkRequestAction(action({ thunk: 'FOO_1234567890123456' }))).toBe(false)
  expect(isThunkRequestAction(action({ thunk: 'FOO_1234567890123456_REQUEST' }))).toBe(true)
})

test('getThunkMeta', () => {
  expect(getThunkMeta(action({}))).toBeNull()
  expect(getThunkMeta(action({ thunk: true }))).toBe(true)
  expect(getThunkMeta(action({ thunk: { id: 1 } }))).toEqual({ id: 1 })
})

test('createThunkAction', () => {
  expect(createThunkAction({ type: 'FOO' }, 'foo')).toEqual({
    type: 'FOO',
    meta: {
      thunk: 'foo',
    },
  })
})

test('getThunkName', () => {
  expect(getThunkName({ type: 'FOO' })).toBe('FOO')
  expect(getThunkName({
    type: 'FOO',
    meta: {},
  })).toBe('FOO')
  expect(getThunkName({
    type: 'FOO',
    meta: {
      thunk: true,
    },
  })).toBe('FOO')
  expect(getThunkName({
    type: 'FOO',
    meta: {
      thunk: { id: 1 },
    },
  })).toBe('FOO')
  expect(getThunkName({
    type: 'FOO',
    meta: {
      thunk: 'BAR',
    },
  })).toBe('BAR')
  expect(getThunkName({
    type: 'FOO',
    meta: {
      thunk: 'BAR_1234567890123456_REQUEST',
    },
  })).toBe('BAR')
  expect(getThunkName({
    type: 'FOO',
    meta: {
      thunk: 'BAR_1234567890123456_RESPONSE',
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
      thunk: true,
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      thunk: { id: 1 },
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      thunk: 'FOO',
    },
  })).toBe(false)
  expect(hasKey({
    type: 'FOO',
    meta: {
      thunk: 'FOO_1234567890123456_REQUEST',
    },
  })).toBe(true)
})

test('generateThunkKey', () => {
  expect(generateThunkKey({
    type: 'FOO',
    meta: {
      thunk: 'FOO',
    },
  })).toEqual(expect.stringMatching(/^FOO_\d{16}_REQUEST/))
  expect(generateThunkKey({
    type: 'FOO',
    meta: {
      thunk: true,
    },
  })).toEqual(expect.stringMatching(/^FOO_\d{16}_REQUEST/))
  expect(generateThunkKey({
    type: 'FOO',
    meta: {
      thunk: { id: 1 },
    },
  })).toEqual(expect.stringMatching(/^FOO_\d{16}_REQUEST/))
  expect(generateThunkKey({
    type: 'FOO',
  })).toEqual(expect.stringMatching(/^FOO_\d{16}_REQUEST/))
  expect(generateThunkKey({
    type: 'FOO',
    meta: {
      thunk: 'FOO_1234567890123456_REQUEST',
    },
  })).toEqual(expect.stringMatching(/^FOO_1234567890123456_RESPONSE/))
})
