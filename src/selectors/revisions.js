import { createSelector } from 'reselect';

export const getRevisions = createSelector(
	state => state.query.user,
	state => state.revisions,
	state => state.pages,
	( users, revisions, pages ) => {
		return revisions.filter( ( revision ) => {
			const exists = users.filter( ( user ) => {
				if ( !pages.has( revision.pageid ) ) {
					return false;
				}

				return pages.get( revision.pageid ).editors.get( user, false );
			} );

			// If the page exists for all users, then it
			// should be included.
			return exists.size === users.size;
		} );
	}
);

export default getRevisions;
