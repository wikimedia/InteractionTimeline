import { createSelector } from 'reselect';

export const getStatus = createSelector(
	state => state.revisions.status,
	state => state.query.user,
	state => state.query.wiki,
	state => state.revisions.list,
	( status, users, wiki, revisions ) => {
		if ( status === 'done' && revisions.isEmpty() ) {
			return 'noresults';
		} else if ( status === 'notready' ) {
			if ( wiki && users.count() >= 2 ) {
				return 'formcomplete';
			}

			if ( wiki && users.count() < 2 ) {
				return 'nousers';
			}

			if ( !wiki && users.count() >= 2 ) {
				return 'nowiki';
			}
		}

		return status;
	}
);

export default getStatus;
