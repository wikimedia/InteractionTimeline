import { Map } from 'immutable';
import Page from 'app/entities/page';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'PAGES_SET':
			return action.pages;
		case 'REVISIONS_SET':
		case 'REVISIONS_ADD':
			const pages = action.revisions.reduce( ( reduction, revision ) => {
				if ( reduction.has( revision.pageid ) ) {
					return reduction.setIn( [ revision.pageid, 'editors', revision.user ], true );
				}

				return reduction.set( revision.pageid, new Page( {
					id: revision.pageid,
					title: revision.title,
					editors: new Map( {
						[ revision.user ]: true
					} )
				} ) );
			}, new Map() );

			return state.mergeDeep( pages );
		case 'PAGES_UPDATE':
			return state.mergeDeep( action.pages );
		case 'PAGES_DELETE':
			return action.pages.reduce( ( map, page ) => {
				return map.remove( page.id );
			}, state );
		case 'QUERY_WIKI_CHANGE':
			return new Map();
		default:
			return state;
	}
};
