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

const expectStateToMatch = (thunk, error, pending, rejected, fulfilled, done) =>
  expect(reducer(initialState, action({ thunk }, error)))
    .toEqual({
      [PENDING]: { FOO: pending },
      [REJECTED]: { FOO: rejected },
      [FULFILLED]: { FOO: fulfilled },
      [DONE]: { FOO: done },
    })

it('handles PENDING', () => {
  expectStateToMatch('FOO_1234567890123456_REQUEST', false, true, false, false, false)
})

it('handles FULFILLED', () => {
  expectStateToMatch('FOO_1234567890123456_RESPONSE', false, false, false, true, true)
})

it('handles REJECTED', () => {
  expectStateToMatch('FOO_1234567890123456_RESPONSE', true, false, true, false, true)
})
