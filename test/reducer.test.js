import { reducer } from '../src'
import { PENDING, REJECTED, FULFILLED, DONE, initialState } from '../src/selectors'

const action = (meta, error) => ({
  type: 'FOO',
  error,
  ...meta ? { meta } : {},
})

it('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
  expect(reducer(undefined, action())).toEqual(initialState)
})

const expectStateToMatch = (
  state,
  thunk,
  error,
  pending,
  rejected,
  fulfilled,
  done,
) =>
  expect(reducer(state, action({ thunk }, error))).toEqual({
    [PENDING]: { FOO: pending },
    [REJECTED]: { FOO: rejected },
    [FULFILLED]: { FOO: fulfilled },
    [DONE]: { FOO: done },
  })

it('handles PENDING', () => {
  expectStateToMatch(initialState, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'REQUEST',
  }, false, true, false, false, false)
  expectStateToMatch(initialState, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'REQUEST',
    id: 1,
  }, false, { 1: true }, false, false, false)
  expectStateToMatch({
    ...initialState,
    [PENDING]: { FOO: { 2: true } },
  }, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'REQUEST',
    id: 1,
  }, false, { 1: true, 2: true }, false, false, false)
})

it('handles FULFILLED', () => {
  expectStateToMatch(initialState, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'RESPONSE',
  }, false, false, false, true, true)
  expectStateToMatch(initialState, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'RESPONSE',
    id: 1,
  }, false, false, false, { 1: true }, { 1: true })
  expectStateToMatch({
    ...initialState,
    [PENDING]: { FOO: { 1: true } },
  }, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'RESPONSE',
    id: 1,
  }, false, false, false, { 1: true }, { 1: true })
})

it('handles REJECTED', () => {
  expectStateToMatch(initialState, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'RESPONSE',
  }, true, false, true, false, true)
  expectStateToMatch(initialState, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'RESPONSE',
    id: 1,
  }, true, false, { 1: true }, false, { 1: true })
  expectStateToMatch({
    ...initialState,
    [PENDING]: { FOO: { 1: true } },
  }, {
    key: '1234567890123456',
    name: 'FOO',
    type: 'RESPONSE',
    id: 1,
  }, true, false, { 1: true }, false, { 1: true })
})
