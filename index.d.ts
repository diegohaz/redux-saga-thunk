import { Action } from "redux";

/* *
 * Redux Saga Thunk Action
 * 
 * ensures existence of [meta]: object in Redux Action with [thunk]: boolean
 */
export interface ReduxSagaThunkAction extends Action {
    meta: {
        thunk: boolean,
        [x: string]: any 
    }
}

/* *
 * Redux Saga Thunk Middleware
 */
export const middleware: any;

/* *
 * Redux Saga Thunk Selectors
 */
type ReduxSagaThunkSelector = (state: any, name: string | string[]) => boolean;

export const isPending: ReduxSagaThunkSelector;
export const hasFailed: ReduxSagaThunkSelector;
export const isDone: ReduxSagaThunkSelector;
export const isComplete: ReduxSagaThunkSelector;

/* *
 * Redux Saga Thunk Reducer
 */
export const reducer: any;
