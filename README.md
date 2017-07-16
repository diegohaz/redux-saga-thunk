# redux-saga-thunk

[![Generated with nod](https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square)](https://github.com/diegohaz/nod)
[![NPM version](https://img.shields.io/npm/v/redux-saga-thunk.svg?style=flat-square)](https://npmjs.org/package/redux-saga-thunk)
[![Build Status](https://img.shields.io/travis/diegohaz/redux-saga-thunk/master.svg?style=flat-square)](https://travis-ci.org/diegohaz/redux-saga-thunk) [![Coverage Status](https://img.shields.io/codecov/c/github/diegohaz/redux-saga-thunk/master.svg?style=flat-square)](https://codecov.io/gh/diegohaz/redux-saga-thunk/branch/master)

Dispatching an action handled by [redux-saga](https://github.com/redux-saga/redux-saga) returns promise. It looks like [redux-thunk](https://github.com/gaearon/redux-thunk), but with pure action creators.

```js
class MyComponent extends React.Component {
  componentWillMount() {
    // `doSomething` dispatches an action which is handled by some saga
    this.props.doSomething().then((detail) => {
      console.log('Yaay!', detail)
    }).catch((error) => {
      console.log('Oops!', error)
    })
  }
}
```

> `redux-saga-thunk` uses [Flux Standard Action](https://github.com/acdlite/flux-standard-action) to determine action's `payload`, `error` etc.

## Motivation

There are two reasons I created this library: Server Side Rendering and [redux-form](https://github.com/erikras/redux-form).

When using [redux-saga](https://github.com/redux-saga/redux-saga) on server, you will need to know when your actions have been finished so you can send the response to the client. There are several ways to handle that case, and `redux-saga-thunk` approach is the one I like most. See [an example](https://github.com/diegohaz/arc/blob/d194b7e9578bdf3ad70a1e0d4c09ceca849f164e/src-example/containers/PostList.js#L33).

With [redux-form](https://github.com/erikras/redux-form), you need to return a promise from `dispatch` inside your submit handler so it will know when the submission is complete. See [an example](https://github.com/diegohaz/arc/blob/8d46b9e52db3f1066b124b93cf8b92d05094fe1c/src-example/containers/PostForm.js#L10)

Finally, that's a nice way to migrate your codebase from `redux-thunk` to `redux-saga`, since you will not need to change how you dispatch your actions, they will still return promises.

## Install

    $ npm install --save redux-saga-thunk

## Basic setup

Add `middleware` to your redux configuration (**before redux-saga middleware**):

```js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'
^

const sagaMiddleware = createSagaMiddleware()
const store = createStore({}, applyMiddleware(thunkMiddleware, sagaMiddleware))
                                              ^
```

## Usage

Add `meta.thunk` to your actions and receive `thunk` on response actions:

```js
const resourceCreateRequest = data => ({
  type: 'RESOURCE_CREATE_REQUEST', // you can name it as you want
  payload: data,
  meta: {
    thunk: true
    ^
  }
})

const resourceCreateSuccess = (detail, thunk) => ({
                                       ^
  type: 'RESOURCE_CREATE_SUCCESS', // name really doesn't matter
  payload: detail, // promise will return payload
  meta: {
    thunk
    ^
  }
})

const resourceCreateFailure = (error, thunk) => ({
                                      ^
  type: 'RESOURCE_CREATE_FAILURE',
  error: true, // redux-saga-thunk will use this to determine if that's a failed action
  payload: error,
  meta: {
    thunk
    ^
  }
})
```

`redux-saga-thunk` will automatically transform your request action and inject a `key` into it.

Handle actions with `redux-saga` like you normally do, but you'll need to grab `meta.thunk` from the request action and pass it to the response actions:

```js
// thunk will be transformed in something like 'RESOURCE_CREATE_REQUEST_1234567890123456_REQUEST'
// the 16 digits in the middle are necessary to handle multiple thunk actions with same type
function* createResource() {
  while(true) {
    const { payload, meta } = yield take('RESOURCE_CREATE_REQUEST')
                     ^
    try {
      const detail = yield call(callApi, payload)
      yield put(resourceCreateSuccess(detail, meta.thunk))
                                              ^
    } catch (e) {
      yield put(resourceCreateFailure(e, meta.thunk))
                                         ^
    }
  }
}
```

Dispatch the action from somewhere. Since that's being intercepted by `thunkMiddleware` cause you set `meta.thunk` on the action, dispatch will return a promise.

```js
store.dispatch(resourceCreateRequest({ title: 'foo' })).then((detail) => {
  // detail is the action payload property
  console.log('Yaay!', detail)
}).catch((error) => {
  // error is the action payload property
  console.log('Oops!', error)
})
```

Or use it inside sagas with [`put.resolve`](https://redux-saga.js.org/docs/api/#putresolveaction):

```js
function *someSaga() {
  try {
    const detail = yield put.resolve(resourceCreateRequest({ title: 'foo' }))
    console.log('Yaay!', detail)
  } catch (error) {
    console.log('Oops!', error)
  }
}
```

## Usage with selectors

To use `isPending`, `hasFailed`, `isDone` and `isComplete` selectors, you'll need to add the `thunkReducer` to your store:

```js
import { combineReducers } from 'redux'
import { reducer as thunkReducer } from 'redux-saga-thunk'

const reducer = combineReducers({
  thunk: thunkReducer,
  // your reducers...
})
```

Now you can use selectors on your containers:

```js
import { isPending, hasFailed, isDone, isComplete } from 'redux-saga-thunk'

const mapStateToProps = state => ({
  loading: isPending(state, 'RESOURCE_CREATE_REQUEST'),
  error: hasFailed(state, 'RESOURCE_CREATE_REQUEST'),
  done: isDone(state, 'RESOURCE_CREATE_REQUEST'),
  complete: isComplete(state, 'RESOURCE_CREATE_REQUEST'),
})
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### isPending

Tells if an action is pending

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooIsPending: isPending(state, 'FOO'),
  fooOrBarIsPending: isPending(state, ['FOO', 'BAR']),
  anythingIsPending: isPending(state)
})
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### hasFailed

Tells if an action has failed

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooHasFailed: hasFailed(state, 'FOO'),
  fooOrBarHasFailed: hasFailed(state, ['FOO', 'BAR']),
  anythingHasFailed: hasFailed(state)
})
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### isDone

Tells if an action is done

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooIsDone: isDone(state, 'FOO'),
  fooOrBarIsDone: isDone(state, ['FOO', 'BAR']),
  anythingIsDone: isDone(state)
})
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### isComplete

Tells if an action is complete

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooIsComplete: isComplete(state, 'FOO'),
  fooOrBarIsComplete: isComplete(state, ['FOO', 'BAR']),
  anythingIsComplete: isComplete(state)
})
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## License

MIT © [Diego Haz](https://github.com/diegohaz)
