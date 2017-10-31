import { combineEpics } from 'redux-observable';
import * as QueryEpics from './query';
import * as WikiEpics from './wiki';

export default combineEpics( ...Object.values( QueryEpics ), ...Object.values( WikiEpics ) );
