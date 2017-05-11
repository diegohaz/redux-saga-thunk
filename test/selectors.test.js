import * as selectors from '../src/selectors'

const altState = {
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
}

test('initialState', () => {
  expect(selectors.initialState).toEqual({
    [selectors.PENDING]: {},
    [selectors.FAILURE]: {},
  })
})

test('getPendingState', () => {
  expect(selectors.getPendingState({})).toEqual({})
  expect(selectors.getPendingState())
    .toEqual(selectors.initialState[selectors.PENDING])
  expect(selectors.getPendingState(selectors.initialState))
    .toEqual(selectors.initialState[selectors.PENDING])
})

test('getFailureState', () => {
  expect(selectors.getFailureState({})).toEqual({})
  expect(selectors.getFailureState())
    .toEqual(selectors.initialState[selectors.FAILURE])
  expect(selectors.getFailureState(selectors.initialState))
    .toEqual(selectors.initialState[selectors.FAILURE])
})

describe('isPending', () => {
  test('all', () => {
    expect(selectors.isPending()).toBe(false)
    expect(selectors.isPending(selectors.initialState)).toBe(false)
    expect(selectors.isPending(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.isPending(selectors.initialState, 'FETCH_USER')).toBe(false)
    expect(selectors.isPending(altState, 'FETCH_USER')).toBe(false)
    expect(selectors.isPending(altState, 'FETCH_USERS')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.isPending(selectors.initialState, ['FETCH_USER'])).toBe(false)
    expect(selectors.isPending(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(false)
    expect(selectors.isPending(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(true)
    expect(selectors.isPending(altState, ['FETCH_USERS', 'FETCH_USER'])).toBe(true)
  })
})

describe('hasFailed', () => {
  test('all', () => {
    expect(selectors.hasFailed()).toBe(false)
    expect(selectors.hasFailed(selectors.initialState)).toBe(false)
    expect(selectors.hasFailed(altState)).toBe(true)
  })

  test('with prefix', () => {
    expect(selectors.hasFailed(selectors.initialState, 'FETCH_USERS')).toBe(false)
    expect(selectors.hasFailed(altState, 'FETCH_USERS')).toBe(false)
    expect(selectors.hasFailed(altState, 'CREATE_USER')).toBe(true)
  })

  test('with array prefix', () => {
    expect(selectors.hasFailed(selectors.initialState, ['FETCH_USER'])).toBe(false)
    expect(selectors.hasFailed(altState, ['FETCH_USER', 'FETCH_USERS'])).toBe(false)
    expect(selectors.hasFailed(altState, ['FETCH_USER', 'CREATE_USER'])).toBe(true)
    expect(selectors.hasFailed(altState, ['CREATE_USER', 'FETCH_USER'])).toBe(true)
  })
})
