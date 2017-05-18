import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware, { delay } from 'redux-saga'
import { put, take, call } from 'redux-saga/effects'
import {
  middleware as thunkMiddleware,
  reducer as thunkReducer,
  isPending,
  hasFailed,
} from '../src'

function* workerSaga(payload, meta) {
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

function* watcherSaga() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { payload, meta } = yield take('FOO_REQUEST')
    yield call(workerSaga, payload, meta)
  }
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [thunkMiddleware, sagaMiddleware]
  const reducer = combineReducers({ thunk: thunkReducer })
  const store = createStore(reducer, {}, applyMiddleware(...middlewares))
  sagaMiddleware.run(watcherSaga)
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

  it('calls success', async () => {
    const payload = 'success'
    const { dispatch, getState } = configureStore()
    expect(dispatch(fooRequest(payload))).toBeInstanceOf(Promise)
    await delay(400)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(true)
    await delay(200)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(false)
  })

  it('calls failure', async () => {
    const payload = 'failure'
    const { dispatch, getState } = configureStore()
    expect(dispatch(fooRequest(payload))).toBeInstanceOf(Promise)
    await delay(400)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(true)
    await delay(200)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(false)
    expect(hasFailed(getState(), 'FOO_REQUEST')).toBe(true)
  })
})
