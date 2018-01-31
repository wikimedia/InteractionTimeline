import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_ADD':
			return state.mergeDeep( action.pages );
		case 'QUERY_USER_CHANGE':

			return state.reduce( ( map, page ) => {
				// Remove the editors that are no longer in the query.
				const editors = page.editors.filter( ( edited, user ) => {
					return action.users.includes( user );
				} );

				page = page.set( 'editors', editors );

				// If there are no more editors, the entire page can be removed.
				if ( page.editors.isEmpty() ) {
					return map.delete( page.id );
				}

				// Return the updated page.
				return map.set( page.id, page );
			}, state );
		case 'QUERY_WIKI_CHANGE':
			return new Map();
		default:
			return state;
	}
};
