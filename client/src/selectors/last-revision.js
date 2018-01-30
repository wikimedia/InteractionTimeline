import { createSelector } from 'reselect';
import lastRevision from 'app/utils/last-revision';

export const getLastRevision = createSelector(
	state => state.query.user,
	state => state.revisions.list,
	state => state.revisions.cont,
	( users, revisions, cont ) => {
		return lastRevision( revisions, users, cont );
	}
);

export default getLastRevision;
