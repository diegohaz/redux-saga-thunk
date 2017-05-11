import { isAsyncAction, isAsyncRequestAction } from '../src/utils'

const action = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})
const done = () => {}
const name = 'foo'
const key = '123'

test('isAsyncAction', () => {
  expect(isAsyncAction(action())).toBe(false)
  expect(isAsyncAction(action({}))).toBe(false)
  expect(isAsyncAction(action({ async: {} }))).toBe(false)
  expect(isAsyncAction(action({ async: { name } }))).toBe(true)
  expect(isAsyncAction(action({ async: { done } }))).toBe(false)
  expect(isAsyncAction(action({ async: { done, name } }))).toBe(true)
  expect(isAsyncAction(action({ async: { done, name, key } }))).toBe(true)
  expect(isAsyncAction(action({ async: { done, key } }))).toBe(false)
})

test('isAsyncRequestAction', () => {
  expect(isAsyncRequestAction(action())).toBe(false)
  expect(isAsyncRequestAction(action({}))).toBe(false)
  expect(isAsyncRequestAction(action({ async: {} }))).toBe(false)
  expect(isAsyncRequestAction(action({ async: { done } }))).toBe(false)
  expect(isAsyncRequestAction(action({ async: { done, name } }))).toBe(false)
  expect(isAsyncRequestAction(action({ async: { done, name, key } }))).toBe(true)
})
