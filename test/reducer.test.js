import { reducer } from '../src'
import {
  PENDING,
  REJECTED,
  FULFILLED,
  DONE,
  initialState,
} from '../src/selectors'
import { clean } from '../src/actions'

const action = (meta, error) => ({
  type: 'FOO',
  error,
  ...(meta ? { meta } : {}),
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
  expectStateToMatch(
    initialState,
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'REQUEST',
    },
    false,
    true,
    false,
    false,
    false,
  )
  expectStateToMatch(
    initialState,
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'REQUEST',
      id: 1,
    },
    false,
    { 1: true },
    false,
    false,
    false,
  )
  expectStateToMatch(
    {
      ...initialState,
      [PENDING]: { FOO: { 2: true } },
    },
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'REQUEST',
      id: 1,
    },
    false,
    { 1: true, 2: true },
    false,
    false,
    false,
  )
})

it('handles FULFILLED', () => {
  expectStateToMatch(
    initialState,
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'RESPONSE',
    },
    false,
    false,
    false,
    true,
    true,
  )
  expectStateToMatch(
    initialState,
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'RESPONSE',
      id: 1,
    },
    false,
    false,
    false,
    { 1: true },
    { 1: true },
  )
  expectStateToMatch(
    {
      ...initialState,
      [PENDING]: { FOO: { 1: true } },
    },
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'RESPONSE',
      id: 1,
    },
    false,
    false,
    false,
    { 1: true },
    { 1: true },
  )
})

it('handles REJECTED', () => {
  expectStateToMatch(
    initialState,
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'RESPONSE',
    },
    true,
    false,
    true,
    false,
    true,
  )
  expectStateToMatch(
    initialState,
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'RESPONSE',
      id: 1,
    },
    true,
    false,
    { 1: true },
    false,
    { 1: true },
  )
  expectStateToMatch(
    {
      ...initialState,
      [PENDING]: { FOO: { 1: true } },
    },
    {
      key: '1234567890123456',
      name: 'FOO',
      type: 'RESPONSE',
      id: 1,
    },
    true,
    false,
    { 1: true },
    false,
    { 1: true },
  )
})

it('handles CLEAN', () => {
  expect(
    reducer(
      {
        ...initialState,
        [FULFILLED]: { FOO: true },
      },
      clean('FOO'),
    ),
  ).toEqual(initialState)

  expect(
    reducer(
      {
        ...initialState,
        [FULFILLED]: { FOO: { 1: true } },
      },
      clean('FOO', 1),
    ),
  ).toEqual({
    ...initialState,
    [FULFILLED]: { FOO: false },
  })

  expect(
    reducer(
      {
        ...initialState,
        [FULFILLED]: { FOO: { 1: true, 2: false } },
      },
      clean('FOO', 2),
    ),
  ).toEqual({
    ...initialState,
    [FULFILLED]: { FOO: { 1: true } },
  })

  expect(
    reducer(
      {
        ...initialState,
        [FULFILLED]: { FOO: { 1: true, 2: false } },
      },
      clean('FOO'),
    ),
  ).toEqual(initialState)
})
