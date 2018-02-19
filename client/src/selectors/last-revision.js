import { createSelector } from 'reselect';
import lastRevision from 'app/utils/last-revision';

export const getLastRevision = createSelector(
	state => state.revisions.list,
	state => state.query.user,
	state => state.revisions.cont,
	lastRevision
);

export default getLastRevision;
