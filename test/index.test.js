import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware, { delay } from 'redux-saga'
import { put, take, call, fork, takeEvery } from 'redux-saga/effects'
import {
  middleware as thunkMiddleware,
  reducer as thunkReducer,
  isPending,
  hasFailed,
} from '../src'

function* foo(payload, meta) {
  yield call(delay, 500)
  if (payload === 'success') {
    yield put({
      type: 'FOO_SUCCESS',
      payload,
      meta: {
        thunk: meta.thunk,
      },
    })
  } else {
    yield put({
      type: 'FOO_FAILURE',
      error: true,
      payload,
      meta: {
        thunk: meta.thunk,
      },
    })
  }
}

function* watchFoo() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { payload, meta } = yield take('FOO_REQUEST')
    yield call(foo, payload, meta)
  }
}


function* bar({ payload, meta }) {
  yield put({ type: 'BAR_SUCCESS', payload, meta })
}

function* watchBar() {
  yield takeEvery('BAR_REQUEST', bar)
}

function* sagas() {
  yield fork(watchFoo)
  yield fork(watchBar)
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [thunkMiddleware, sagaMiddleware]
  const reducer = combineReducers({ thunk: thunkReducer })
  const store = createStore(reducer, {}, applyMiddleware(...middlewares))
  sagaMiddleware.run(sagas)
  return store
}

describe('Integration test', () => {
  const fooRequest = payload => ({
    type: 'FOO_REQUEST',
    payload,
    meta: {
      thunk: true,
    },
  })

  const barRequest = payload => ({
    type: 'BAR_REQUEST',
    payload,
    meta: {
      thunk: true,
    },
  })

  it('calls success', async () => {
    const { dispatch, getState } = configureStore()
    const promise = dispatch(fooRequest('success'))
    expect(promise).toBeInstanceOf(Promise)
    await delay(400)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(true)
    await expect(promise).resolves.toBe('success')
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(false)
  })

  it('calls failure', async () => {
    const { dispatch, getState } = configureStore()
    const promise = dispatch(fooRequest('failure'))
    expect(promise).toBeInstanceOf(Promise)
    await delay(400)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(true)
    await expect(promise).rejects.toBe('failure')
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(false)
    expect(hasFailed(getState(), 'FOO_REQUEST')).toBe(true)
  })

  it('calls success immediatly', async () => {
    const { dispatch, getState } = configureStore()
    const promise = dispatch(barRequest('success'))
    expect(promise).toBeInstanceOf(Promise)
    await expect(promise).resolves.toBe('success')
    expect(isPending(getState(), 'BAR_REQUEST')).toBe(false)
  })
})
