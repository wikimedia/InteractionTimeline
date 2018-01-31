import { OrderedMap } from 'immutable';

export default ( state = new OrderedMap(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_DELETE':
			return action.revisions.reduce( ( map, revision ) => {
				return map.remove( revision.id );
			}, state );
		case 'REVISIONS_ADD':
			return state
				.merge( action.revisions )
				// Since the ids are all from the same wiki, they are in a guaranteed
				// order from oldest to newest.
				.sortBy( revision => revision.id );
		case 'REVISIONS_SET':
			return action.revisions.sortBy( revision => revision.id );
		case 'QUERY_WIKI_CHANGE':
		case 'QUERY_START_DATE_CHANGE':
		case 'QUERY_END_DATE_CHANGE':
			return new OrderedMap();
		case 'QUERY_USER_CHANGE':
			return state.filter( revision => {
				return action.users.includes( revision.user );
			} );
		default:
			return state;
	}
};
