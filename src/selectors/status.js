import { createSelector } from 'reselect';
import { getRevisions } from './revisions';

export const getStatus = createSelector(
	state => state.revisions.status,
	state => state.query.user,
	state => state.query.wiki,
	state => getRevisions( state ),
	( status, users, wiki, revisions ) => {
		if ( status === 'done' && revisions.isEmpty() ) {
			return 'noresults';
		} else if ( status === 'notready' ) {
			if ( wiki && users.isEmpty() ) {
				return 'nousers';
			} else if ( !wiki && !users.isEmpty() ) {
				return 'nowiki';
			}
		}

		return status;
	}
);

export default getStatus;
