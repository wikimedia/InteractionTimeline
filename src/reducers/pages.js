import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'PAGES_SET':
			return action.pages;
		case 'REVISIONS_ADD':
		case 'PAGES_UPDATE':
			return state.mergeDeep( action.pages );
		case 'PAGES_DELETE':
			return action.pages.reduce( ( map, page ) => {
				return map.remove( page.id );
			}, state );
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
