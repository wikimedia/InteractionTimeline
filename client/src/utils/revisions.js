import { OrderedMap } from 'immutable';

export default ( users, revisions, last, pages ) => {
	if ( !last ) {
		return new OrderedMap();
	}

	return revisions.filter( ( revision ) => {
		// If the revision id is greater than the last id, this revision
		// should not be displayed.
		if ( revision.id > last.id ) {
			return false;
		}

		if ( !users.includes( revision.user ) ) {
			return false;
		}

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
};
