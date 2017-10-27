import { combineEpics } from 'redux-observable';
import * as UserEpics from './users';
import * as WikiEpics from './wiki';

export default combineEpics( ...Object.values( UserEpics ), ...Object.values( WikiEpics ) );
