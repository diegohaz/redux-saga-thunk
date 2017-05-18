import configureStore from 'redux-mock-store'
import { middleware } from '../src'

const mockStore = configureStore([middleware])

const createAction = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})

it('dispatches the exactly same action when it has no meta', () => {
  const { dispatch, getActions } = mockStore({})
  const action = createAction()
  expect(dispatch(action)).toEqual(action)
  expect(getActions()).toEqual([action])
})

it('dispatches the exactly same action when it has no meta.thunk', () => {
  const { dispatch, getActions } = mockStore({})
  const action = createAction({})
  expect(dispatch(action)).toEqual(action)
  expect(getActions()).toEqual([action])
})

it('dispatches an action with request key when it has meta.thunk but no key', () => {
  const { dispatch, getActions } = mockStore({})
  const action = createAction({ thunk: true })
  const expected = createAction({
    thunk: expect.stringMatching(/^FOO_\d{16}_REQUEST$/),
  })
  expect(dispatch(action)).toBeInstanceOf(Promise)
  expect(getActions()).toEqual([expected])
})

it('throws an error when response action is dispatched before request action', () => {
  const { dispatch } = mockStore({})
  const action = createAction({ thunk: 'FOOBAR_1234567890123456_REQUEST' })
  expect(() => dispatch(action)).toThrow('[redux-saga-thunk] FOOBAR should be dispatched before FOO')
})

it('dispatches an action with response key when it has meta.thunk with key', () => {
  const { dispatch, getActions, clearActions } = mockStore({})
  // dispatch request action
  dispatch(createAction({ thunk: 'FOOBAR' }))
  const [key] = getActions()[0].meta.thunk.match(/\d{16}/)
  clearActions()

  const action = createAction({ thunk: `FOOBAR_${key}_REQUEST` })
  const expected = createAction({
    thunk: expect.stringMatching(`FOOBAR_${key}_RESPONSE`),
  })
  expect(dispatch(action)).toEqual(expected)
  expect(getActions()).toEqual([expected])
})
