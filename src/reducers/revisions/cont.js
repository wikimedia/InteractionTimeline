import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_FETCH':
			return action.users.reduce( ( set, user ) => {
				if ( set.has( user ) ) {
					return state;
				}

				return set.set( user, null );
			}, state );
		case 'REVISIONS_ADD':
			return state.merge( action.cont );
		case 'QUERY_USER_CHANGE':
			return state.filter( ( cont, user ) => {
				return action.users.includes( user );
			} );
		case 'QUERY_WIKI_CHANGE':
		case 'QUERY_START_DATE_CHANGE':
		case 'QUERY_END_DATE_CHANGE':
			return new Map();
		case 'REVISIONS_CONTINUE_SET':
			return state.set( action.user, action.cont );
		case 'REVISIONS_CONTINUE_DELETE':
			return state.remove( action.user );
		case 'REVISIONS_ERROR':
			return state.filter( cont => cont !== null );
		default:
			return state;
	}
};
