import {
  isThunkAction,
  isThunkRequestAction,
  getThunkMeta,
  createThunkAction,
  getThunkName,
  hasId,
  getThunkId,
  hasKey,
  generateThunk,
} from '../src/utils'

const actionType = 'FOO'

const action = meta => ({
  type: actionType,
  ...(meta ? { meta } : {}),
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
  expect(isThunkRequestAction(action({ thunk: { type: 'REQUEST' } }))).toBe(
    true,
  )
})

test('getThunkMeta', () => {
  expect(getThunkMeta(action({}))).toBeNull()
  expect(getThunkMeta(action({ thunk: true }))).toBe(true)
  expect(getThunkMeta(action({ thunk: { id: 1 } }))).toEqual({ id: 1 })
})

test('createThunkAction', () => {
  expect(createThunkAction(action(), 'foo')).toEqual(action({ thunk: 'foo' }))
})

test('getThunkName', () => {
  expect(getThunkName(action())).toBe(actionType)
  expect(getThunkName(action({}))).toBe(actionType)
  expect(getThunkName(action({ thunk: true }))).toBe(actionType)
  expect(getThunkName(action({ thunk: { id: 1 } }))).toBe(actionType)
  expect(getThunkName(action({ thunk: 'BAR' }))).toBe('BAR')
  expect(getThunkName(action({ thunk: { name: 'BAR' } }))).toBe('BAR')
})

test('hasId', () => {
  expect(hasId(action({}))).toBe(false)
  expect(hasId(action({ thunk: true }))).toBe(false)
  expect(hasId(action({ thunk: { id: 1 } }))).toBe(true)
  expect(hasId(action({ thunk: { id: undefined } }))).toBe(true)
  expect(hasId(action({ thunk: 'FOO' }))).toBe(false)
})

test('getThunkId', () => {
  expect(getThunkId(action({}))).toBe(undefined)
  expect(getThunkId(action({ thunk: true }))).toBe(undefined)
  expect(getThunkId(action({ thunk: { id: 1 } }))).toBe(1)
  expect(getThunkId(action({ thunk: 'FOO' }))).toBe(undefined)
})

test('hasKey', () => {
  expect(hasKey(action())).toBe(false)
  expect(hasKey(action({}))).toBe(false)
  expect(hasKey(action({ thunk: true }))).toBe(false)
  expect(hasKey(action({ thunk: { id: 1 } }))).toBe(false)
  expect(hasKey(action({ thunk: 'FOO' }))).toBe(false)
  expect(hasKey(action({ thunk: { key: '1234567890123456' } }))).toBe(true)
})

test('generateThunk', () => {
  expect(generateThunk(action({ thunk: 'FOO' }))).toMatchObject({
    key: expect.stringMatching(/^\d{16}/),
    name: 'FOO',
    type: 'REQUEST',
  })
  expect(generateThunk(action({ thunk: true }))).toMatchObject({
    key: expect.stringMatching(/^\d{16}/),
    name: actionType,
    type: 'REQUEST',
  })
  expect(generateThunk(action({ thunk: { id: 1 } }))).toMatchObject({
    id: 1,
    key: expect.stringMatching(/^\d{16}/),
    name: actionType,
    type: 'REQUEST',
  })
  expect(generateThunk(action())).toMatchObject({
    key: expect.stringMatching(/^\d{16}/),
    name: actionType,
    type: 'REQUEST',
  })
  expect(
    generateThunk(
      action({ thunk: { key: '1234567890123456', type: 'REQUEST' } }),
    ),
  ).toMatchObject({ type: 'RESPONSE' })
})
