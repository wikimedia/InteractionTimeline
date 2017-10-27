import { combineEpics } from 'redux-observable';
import * as UserEpics from './users';

export default combineEpics( ...Object.values( UserEpics ) );
