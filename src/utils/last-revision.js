import { OrderedSet } from 'immutable';

export default ( revisions, users, cont ) => {
	// Remove any users who are already done.
	users = users.filter( user => cont.get( user ) !== false );

	// If there are no users, return the last revision.
	if ( users.isEmpty() ) {
		return revisions.last();
	}

	// Get the last revision of each user and order by revision id.
	return users.reduce( ( set, user ) => {
		const last = revisions.filter( revision => revision.user === user ).last();

		if ( last ) {
			return set.add( last );
		}

		return set;
	}, new OrderedSet() )
		.sortBy( revision => revision.id )
		// The first revision in the list is the last one that should be displayed.
		.first();
};
