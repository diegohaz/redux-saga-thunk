# redux-saga-thunk

[![Generated with nod](https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square)](https://github.com/diegohaz/nod)
[![NPM version](https://img.shields.io/npm/v/redux-saga-thunk.svg?style=flat-square)](https://npmjs.org/package/redux-saga-thunk)
[![NPM downloads](https://img.shields.io/npm/dm/redux-saga-thunk.svg?style=flat-square)](https://npmjs.org/package/redux-saga-thunk)
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

<br>
<hr>
<p align="center">
If you find this useful, please don't forget to star ⭐️ the repo, as this will help to promote the project.<br>
Follow me on <a href="https://twitter.com/diegohaz">Twitter</a> and <a href="https://github.com/diegohaz">GitHub</a> to keep updated about this project and <a href="https://github.com/diegohaz?tab=repositories">others</a>.
</p>
<hr>
<br>

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

You just need to set `meta.thunk` to `true` on your request actions and put it on your response actions inside the saga:

```js
const action = {
  type: 'RESOURCE_REQUEST',
  payload: { id: 'foo' },
  meta: {
    thunk: true
    ^
  }
}

// send the action
store.dispatch(action).then((detail) => {
  // payload == detail
  console.log('Yaay!', detail)
}).catch((e) => {
  // payload == e
  console.log('Oops!', e)
})

function* saga() {
  while(true) {
    const { payload, meta } = yield take('RESOURCE_REQUEST') 
                     ^
    try {
      const detail = yield call(callApi, payload) // payload == { id: 'foo' }
      yield put({
        type: 'RESOURCE_SUCCESS',
        payload: detail,
        meta
        ^
      })
    } catch (e) {
      yield put({
        type: 'RESOURCE_FAILURE',
        payload: e,
        error: true,
        ^
        meta
        ^
      })
    }
  }
}
```

`redux-saga-thunk` will automatically transform your request action and inject a `key` into it.

You can also use it inside sagas with [`put.resolve`](https://redux-saga.js.org/docs/api/#putresolveaction):

```js
function *someSaga() {
  try {
    const detail = yield put.resolve(action)
    console.log('Yaay!', detail)
  } catch (error) {
    console.log('Oops!', error)
  }
}
```

## Usage with selectors

To use `pending`, `rejected`, `fulfilled` and `done` selectors, you'll need to add the `thunkReducer` to your store:

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
import { pending, rejected, fulfilled, done } from 'redux-saga-thunk'

const mapStateToProps = state => ({
  loading: pending(state, 'RESOURCE_CREATE_REQUEST'),
  error: rejected(state, 'RESOURCE_CREATE_REQUEST'),
  success: fulfilled(state, 'RESOURCE_CREATE_REQUEST'),
  done: done(state, 'RESOURCE_CREATE_REQUEST'),
})
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [clean](#clean)
-   [pending](#pending)
-   [rejected](#rejected)
-   [fulfilled](#fulfilled)
-   [done](#done)

### clean

Clean state

**Parameters**

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `id` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

**Examples**

```javascript
const mapDispatchToProps = (dispatch, ownProps) => ({
  cleanFetchUserStateForAllIds: () => dispatch(clean('FETCH_USER')),
  cleanFetchUserStateForSpecifiedId: () => dispatch(clean('FETCH_USER', ownProps.id)),
  cleanFetchUsersState: () => dispatch(clean('FETCH_USERS')),
})
```

### pending

Tells if an action is pending

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | \[[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))])>)** 
-   `id` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooIsPending: pending(state, 'FOO'),
  barForId42IsPending: pending(state, 'BAR', 42),
  barForAnyIdIsPending: pending(state, 'BAR'),
  fooOrBazIsPending: pending(state, ['FOO', 'BAZ']),
  fooOrBarForId42IsPending: pending(state, ['FOO', ['BAR', 42]]),
  anythingIsPending: pending(state)
})
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### rejected

Tells if an action was rejected

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | \[[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))])>)** 
-   `id` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooWasRejected: rejected(state, 'FOO'),
  barForId42WasRejected: rejected(state, 'BAR', 42),
  barForAnyIdWasRejected: rejected(state, 'BAR'),
  fooOrBazWasRejected: rejected(state, ['FOO', 'BAZ']),
  fooOrBarForId42WasRejected: rejected(state, ['FOO', ['BAR', 42]]),
  anythingWasRejected: rejected(state)
})
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### fulfilled

Tells if an action is fulfilled

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | \[[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))])>)** 
-   `id` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooIsFulfilled: fulfilled(state, 'FOO'),
  barForId42IsFulfilled: fulfilled(state, 'BAR', 42),
  barForAnyIdIsFulfilled: fulfilled(state, 'BAR'),
  fooOrBazIsFulfilled: fulfilled(state, ['FOO', 'BAZ']),
  fooOrBarForId42IsFulfilled: fulfilled(state, ['FOO', ['BAR', 42]]),
  anythingIsFulfilled: fulfilled(state)
})
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### done

Tells if an action is done

**Parameters**

-   `state` **State** 
-   `name` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | \[[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), ([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))])>)** 
-   `id` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

**Examples**

```javascript
const mapStateToProps = state => ({
  fooIsDone: done(state, 'FOO'),
  barForId42IsDone: done(state, 'BAR', 42),
  barForAnyIdIsDone: done(state, 'BAR'),
  fooOrBazIsDone: done(state, ['FOO', 'BAZ']),
  fooOrBarForId42IsDone: done(state, ['FOO', ['BAR', 42]]),
  anythingIsDone: done(state)
})
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## License

MIT © [Diego Haz](https://github.com/diegohaz)
