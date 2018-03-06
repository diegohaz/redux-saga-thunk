import * as selectors from '../src/selectors'

const altState = {
  thunk: {
    [selectors.PENDING]: {
      FETCH_USER: false,
      FETCH_USERS: true,
      CREATE_USER: false,
      UPDATE_USER: true,
    },
    [selectors.REJECTED]: {
      FETCH_USER: false,
      FETCH_USERS: false,
      CREATE_USER: true,
      UPDATE_USER: true,
    },
    [selectors.FULFILLED]: {
      FETCH_USER: false,
      FETCH_USERS: false,
      CREATE_USER: true,
      UPDATE_USER: true,
    },
    [selectors.DONE]: {
      FETCH_USER: false,
      FETCH_USERS: false,
      CREATE_USER: true,
      UPDATE_USER: true,
    },
  },
}

test('initialState', () => {
  expect(selectors.initialState).toEqual({
    [selectors.PENDING]: {},
    [selectors.REJECTED]: {},
    [selectors.FULFILLED]: {},
    [selectors.DONE]: {},
  })
})

test('getThunkState', () => {
  expect(() => selectors.getThunkState()).toThrow()
  expect(() => selectors.getThunkState({})).toThrow()
  expect(selectors.getThunkState({ thunk: {} })).toEqual({})
})

test('getPendingState', () => {
  expect(selectors.getPendingState({ thunk: undefined }))
    .toEqual(selectors.initialState[selectors.PENDING])
  expect(selectors.getPendingState({ thunk: selectors.initialState }))
    .toEqual(selectors.initialState[selectors.PENDING])
  expect(selectors.getPendingState(altState))
    .toEqual(altState.thunk[selectors.PENDING])
})

test('getRejectedState', () => {
  expect(selectors.getRejectedState({ thunk: undefined }))
    .toEqual(selectors.initialState[selectors.REJECTED])
  expect(selectors.getRejectedState({ thunk: selectors.initialState }))
    .toEqual(selectors.initialState[selectors.REJECTED])
  expect(selectors.getRejectedState(altState))
    .toEqual(altState.thunk[selectors.REJECTED])
})
test('getFulfilledState', () => {
  expect(selectors.getFulfilledState({ thunk: undefined }))
    .toEqual(selectors.initialState[selectors.FULFILLED])
  expect(selectors.getFulfilledState({ thunk: selectors.initialState }))
    .toEqual(selectors.initialState[selectors.FULFILLED])
  expect(selectors.getFulfilledState(altState))
    .toEqual(altState.thunk[selectors.FULFILLED])
})

describe('pending', () => {
  test('all', () => {
    expect(selectors.pending({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.pending(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.pending({ thunk: selectors.initialState }, 'FETCH_USER')).toBe(false)
    expect(selectors.pending(altState, 'FETCH_USER')).toBe(false)
    expect(selectors.pending(altState, 'FETCH_USERS')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.pending({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.pending(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(false)
    expect(selectors.pending(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(true)
    expect(selectors.pending(altState, ['FETCH_USERS', 'FETCH_USER'])).toBe(true)
  })
})

describe('rejected', () => {
  test('all', () => {
    expect(selectors.rejected({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.rejected(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.rejected({ thunk: selectors.initialState }, 'FETCH_USERS')).toBe(false)
    expect(selectors.rejected(altState, 'FETCH_USERS')).toBe(false)
    expect(selectors.rejected(altState, 'CREATE_USER')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.rejected({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.rejected(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(false)
    expect(selectors.rejected(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(true)
    expect(selectors.rejected(altState, ['CREATE_USER', 'FETCH_USER'])).toBe(true)
  })
})

describe('fulfilled', () => {
  test('all', () => {
    expect(selectors.fulfilled({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.fulfilled(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.fulfilled({ thunk: selectors.initialState }, 'FETCH_USERS')).toBe(false)
    expect(selectors.fulfilled(altState, 'FETCH_USERS')).toBe(false)
    expect(selectors.fulfilled(altState, 'CREATE_USER')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.fulfilled({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.fulfilled(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(false)
    expect(selectors.fulfilled(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(true)
    expect(selectors.fulfilled(altState, ['CREATE_USER', 'FETCH_USER'])).toBe(true)
  })
})

describe('done', () => {
  test('all', () => {
    expect(selectors.done({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.done(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.done({ thunk: selectors.initialState }, 'FETCH_USERS')).toBe(false)
    expect(selectors.done(altState, 'FETCH_USERS')).toBe(false)
    expect(selectors.done(altState, 'CREATE_USER')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.done({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.done(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(false)
    expect(selectors.done(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(true)
    expect(selectors.done(altState, ['CREATE_USER', 'FETCH_USER'])).toBe(true)
  })
})
