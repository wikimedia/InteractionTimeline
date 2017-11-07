import { createSelector } from 'reselect';

export const getRevisions = createSelector(
	state => state.query.user,
	state => state.revisions,
	state => state.pages,
	( users, revisions, pages ) => {
		return revisions.filter( ( revision ) => {
			const exists = users.map( ( user ) => {
				if ( !pages.has( user ) ) {
					return false;
				}

				return pages.get( user ).has( revision.pageid );
			} );

			// If the page exists for all users, then it
			// should be included.
			return exists.size === users.size;
		} );
	}
);

export default getRevisions;
