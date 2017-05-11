import { reducer } from '../src'
import { PENDING, SUCCESS, FAILURE, initialState } from '../src/selectors'

const action = meta => ({
  type: 'FOO',
  ...meta ? { meta } : {},
})

it('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState)
  expect(reducer(undefined, action())).toEqual(initialState)
  expect(reducer(undefined, action({ async: { name: 'foo' } }))).toEqual(initialState)
})

const expectStateToMatch = (status, pending, failure) =>
  expect(reducer(initialState, action({ async: { name: 'foo', status } })))
    .toEqual({
      [PENDING]: { foo: pending },
      [FAILURE]: { foo: failure },
    })

it('handles PENDING', () => {
  expectStateToMatch(PENDING, true, false)
})

it('handles SUCCESS', () => {
  expectStateToMatch(SUCCESS, false, false)
})

it('handles FAILURE', () => {
  expectStateToMatch(FAILURE, false, true)
})
