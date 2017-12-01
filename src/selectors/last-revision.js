import { createSelector } from 'reselect';
import lastRevision from 'app/utils/last-revision';

export const getLastRevision = createSelector(
	state => state.query.user,
	state => state.revisions.list,
	( users, revisions ) => {
		// @TODO if all other users are "done" then the last revision in the
		//       revision list is automatically the last revision. We should filter
		//       out users who are marked as done before retrieving the last
		//       revision.
		return lastRevision( revisions, users );
	}
);

export default getLastRevision;
