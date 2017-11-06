import { combineEpics } from 'redux-observable';
import * as QueryEpics from './query';
import * as WikiEpics from './wiki';
import * as TimelineEpics from './timeline';

export default combineEpics(
	...Object.values( QueryEpics ),
	...Object.values( WikiEpics ),
	...Object.values( TimelineEpics ),
);
