import * as selectors from '../src/selectors'

const altState = {
  thunk: {
    [selectors.PENDING]: {
      FETCH_USER: false,
      FETCH_USERS: true,
      CREATE_USER: false,
      UPDATE_USER: true,
    },
    [selectors.FAILURE]: {
      FETCH_USER: false,
      FETCH_USERS: false,
      CREATE_USER: true,
      UPDATE_USER: true,
    },
    [selectors.SUCCESS]: {
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
    [selectors.FAILURE]: {},
    [selectors.SUCCESS]: {},
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

test('getFailureState', () => {
  expect(selectors.getFailureState({ thunk: undefined }))
    .toEqual(selectors.initialState[selectors.FAILURE])
  expect(selectors.getFailureState({ thunk: selectors.initialState }))
    .toEqual(selectors.initialState[selectors.FAILURE])
  expect(selectors.getFailureState(altState))
    .toEqual(altState.thunk[selectors.FAILURE])
})
test('getSuceessState', () => {
  expect(selectors.getSuccessState({ thunk: undefined }))
    .toEqual(selectors.initialState[selectors.SUCCESS])
  expect(selectors.getSuccessState({ thunk: selectors.initialState }))
    .toEqual(selectors.initialState[selectors.SUCCESS])
  expect(selectors.getSuccessState(altState))
    .toEqual(altState.thunk[selectors.SUCCESS])
})

describe('isPending', () => {
  test('all', () => {
    expect(selectors.isPending({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.isPending(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.isPending({ thunk: selectors.initialState }, 'FETCH_USER')).toBe(false)
    expect(selectors.isPending(altState, 'FETCH_USER')).toBe(false)
    expect(selectors.isPending(altState, 'FETCH_USERS')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.isPending({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.isPending(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(false)
    expect(selectors.isPending(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(true)
    expect(selectors.isPending(altState, ['FETCH_USERS', 'FETCH_USER'])).toBe(true)
  })
})

describe('hasFailed', () => {
  test('all', () => {
    expect(selectors.hasFailed({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.hasFailed(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.hasFailed({ thunk: selectors.initialState }, 'FETCH_USERS')).toBe(false)
    expect(selectors.hasFailed(altState, 'FETCH_USERS')).toBe(false)
    expect(selectors.hasFailed(altState, 'CREATE_USER')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.hasFailed({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.hasFailed(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(false)
    expect(selectors.hasFailed(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(true)
    expect(selectors.hasFailed(altState, ['CREATE_USER', 'FETCH_USER'])).toBe(true)
  })
})

describe('hasSuccess', () => {
  test('all', () => {
    expect(selectors.hasSuccess({ thunk: selectors.initialState })).toBe(false)
    expect(selectors.hasSuccess(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.hasSuccess({ thunk: selectors.initialState }, 'FETCH_USERS')).toBe(false)
    expect(selectors.hasSuccess(altState, 'FETCH_USERS')).toBe(false)
    expect(selectors.hasSuccess(altState, 'CREATE_USER')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.hasSuccess({ thunk: selectors.initialState }, ['FETCH_USER'])).toBe(false)
    expect(selectors.hasSuccess(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(false)
    expect(selectors.hasSuccess(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(true)
    expect(selectors.hasSuccess(altState, ['CREATE_USER', 'FETCH_USER'])).toBe(true)
  })
})
