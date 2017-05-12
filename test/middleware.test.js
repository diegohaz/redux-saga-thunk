import configureStore from 'redux-mock-store'
import { middleware } from '../src'

const mockStore = configureStore([middleware])

const createAction = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})

it('dispatches the exactly same action when it has no meta', () => {
  const store = mockStore({})
  const action = createAction()
  expect(store.dispatch(action)).toEqual(action)
  expect(store.getActions()).toEqual([action])
})

it('dispatches the exactly same action when it has no meta.async', () => {
  const store = mockStore({})
  const action = createAction({})
  expect(store.dispatch(action)).toEqual(action)
  expect(store.getActions()).toEqual([action])
})

it('throws an error when it has no name', () => {
  const store = mockStore({})
  const action = createAction({ async: true })
  expect(() => store.dispatch(action)).toThrow()
})

it('dispatches action with proper name when it is defined as string', () => {
  const store = mockStore({})
  const action = createAction({ async: 'foo' })
  const expected = createAction({
    async: expect.objectContaining({ name: 'foo' }),
  })
  expect(store.dispatch(action)).toBeInstanceOf(Promise)
  expect(store.getActions()).toEqual([expected])
})

it('dispatches action with proper name when it is defined as property', () => {
  const store = mockStore({})
  const action = createAction({ async: { name: 'foo' } })
  const expected = createAction({
    async: expect.objectContaining({ name: 'foo' }),
  })
  expect(store.dispatch(action)).toBeInstanceOf(Promise)
  expect(store.getActions()).toEqual([expected])
})

it('dispatches action with proper status and key when it is not defined', () => {
  const store = mockStore({})
  const action = createAction({ async: 'foo' })
  const expected = createAction({
    async: expect.objectContaining({
      key: expect.any(String),
      status: 'pending',
    }),
  })
  expect(store.dispatch(action)).toBeInstanceOf(Promise)
  expect(store.getActions()).toEqual([expected])
})

it('dispatches action with proper status and key when it is defined', () => {
  const store = mockStore({})
  const action = createAction({ async: { name: 'foo', key: '123' } })
  const expected = createAction({
    async: expect.objectContaining({
      key: '123',
      status: 'success',
    }),
  })
  expect(store.dispatch(action)).toEqual(expected)
  expect(store.getActions()).toEqual([expected])
})

it('dispatches action with done method when it is not defined', () => {
  const store = mockStore({})
  const action = createAction({ async: 'foo' })
  const expected = createAction({
    async: expect.objectContaining({ done: expect.any(Function) }),
  })
  expect(store.dispatch(action)).toBeInstanceOf(Promise)
  expect(store.getActions()).toEqual([expected])
})

it('preserves done method when it is defined', () => {
  const done = () => {}
  const store = mockStore({})
  const action = createAction({ async: { name: 'foo', done } })
  const expected = createAction({
    async: expect.objectContaining({ done }),
  })
  expect(store.dispatch(action)).toEqual(expected)
  expect(store.getActions()).toEqual([expected])
})

it('dispathes action with proper status when it has error', () => {
  const store = mockStore({})
  const action = { type: 'FOO', error: true, meta: { async: { name: 'foo', key: '123' } } }
  const expected = expect.objectContaining({
    error: true,
    meta: expect.objectContaining({
      async: expect.objectContaining({
        key: '123',
        status: 'failure',
      }),
    }),
  })
  expect(store.dispatch(action)).toEqual(expected)
  expect(store.getActions()).toEqual([expected])
})
