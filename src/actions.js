// @flow
const PREFIX = '@@redux-saga-thunk/'

export const CLEAN = `${PREFIX}clean`

/**
 * Clean state
 * @example
 * const mapDispatchToProps = (dispatch, ownProps) => ({
 *   cleanFetchUserStateForAllIds: () => dispatch(clean('FETCH_USER')),
 *   cleanFetchUserStateForSpecifiedId: () => dispatch(clean('FETCH_USER', ownProps.id)),
 *   cleanStateForAllActions: () => dispatch(clean()),
 * })
 */
// eslint-disable-next-line import/prefer-default-export
export function clean(name?: string, id?: string | number) {
  return {
    type: CLEAN,
    meta: {
      thunk: arguments.length > 1 ? { name, id } : { name },
    },
  }
}
