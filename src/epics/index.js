import { combineEpics } from 'redux-observable';
import * as QueryEpics from './query';
import * as WikiEpics from './wiki';
import * as RevisionsEpics from './revisions';
import * as PagesEpics from './pages';

export default combineEpics(
	...Object.values( QueryEpics ),
	...Object.values( WikiEpics ),
	...Object.values( RevisionsEpics ),
	...Object.values( PagesEpics ),
);
