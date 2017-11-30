import { OrderedSet } from 'immutable';

export default ( revisions, users ) => {
	// If there are no users, return the last revision.
	if ( !users.size ) {
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
