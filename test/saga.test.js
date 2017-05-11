import { call, fork, takeEvery } from 'redux-saga/effects'
import { isAsyncRequestAction } from '../src/utils'
import saga, * as sagas from '../src/saga'

const action = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})
const done = () => {}
const name = 'foo'
const key = '123'

test('matchResponse', () => {
  const match = sagas.matchResponse
  expect(match(name)(action())).toBe(false)
  expect(match(name)(action({}))).toBe(false)
  expect(match(name)(action({ async: {} }))).toBe(false)
  expect(match(name)(action({ async: { name } }))).toBe(true)
  expect(match(name)(action({ async: { name, key } }))).toBe(false)
  expect(match(name, key)(action({ async: { name, key } }))).toBe(true)
  expect(match('bar')(action({ async: { name } }))).toBe(false)
})

describe('respondToRequest', () => {
  const requestAction = action({ async: { done, name, key } })

  it('calls success', () => {
    const generator = sagas.respondToRequest(requestAction)
    const successAction = {
      ...action({ async: { name } }),
      payload: {
        foo: 'bar',
        baz: 'qux',
      },
    }
    generator.next()
    expect(generator.next({ success: successAction }).value)
      .toEqual(call(requestAction.meta.async.done, null, successAction.payload))
    expect(generator.next().done).toBe(true)
  })

  it('calls failure', () => {
    const generator = sagas.respondToRequest(requestAction)
    const rejectAction = {
      ...action({ async: { name } }),
      payload: new Error(),
    }
    generator.next()
    expect(generator.next({ failure: rejectAction }).value)
      .toEqual(call(requestAction.meta.async.done, rejectAction.payload))
    expect(generator.next().done).toBe(true)
  })
})

test('watchRequestActions', () => {
  const generator = sagas.watchRequestActions()
  expect(generator.next().value)
    .toEqual(takeEvery(isAsyncRequestAction, sagas.respondToRequest))
})

test('saga', () => {
  const generator = saga()
  expect(generator.next().value).toEqual(fork(sagas.watchRequestActions))
})
