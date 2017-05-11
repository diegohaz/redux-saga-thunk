export const isAsyncAction = action => !!(
  action &&
  action.meta &&
  action.meta.async &&
  action.meta.async.name
)

export const isAsyncRequestAction = action => !!(
  isAsyncAction(action) &&
  typeof action.meta.async.done === 'function' &&
  typeof action.meta.async.key !== 'undefined'
)
