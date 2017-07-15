import { reducer } from '../src'
import { PENDING, FAILURE, DONE, COMPLETE, initialState } from '../src/selectors'

const action = (meta, error) => ({
  type: 'FOO',
  error,
  ...meta ? { meta } : {},
})

it('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
  expect(reducer(undefined, action())).toEqual(initialState)
})

const expectStateToMatch = (thunk, error, pending, failure, succeeded, completed) =>
  expect(reducer(initialState, action({ thunk }, error)))
    .toEqual({
      [PENDING]: { FOO: pending },
      [FAILURE]: { FOO: failure },
      [DONE]: { FOO: succeeded },
      [COMPLETE]: { FOO: completed },
    })

it('handles PENDING', () => {
  expectStateToMatch('FOO_1234567890123456_REQUEST', false, true, false, false, false)
})

it('handles DONE', () => {
  expectStateToMatch('FOO_1234567890123456_RESPONSE', false, false, false, true, true)
})

it('handles FAILURE', () => {
  expectStateToMatch('FOO_1234567890123456_RESPONSE', true, false, true, false, true)
})
