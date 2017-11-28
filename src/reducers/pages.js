import { Map } from 'immutable';
import Page from 'app/entities/page';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'PAGES_SET':
			return action.pages;
		case 'REVISIONS_SET':
			const pages = action.revisions.reduce( ( reduction, revision ) => {

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
		case 'QUERY_SET_VALUE':
			switch ( action.key ) {
				case 'wiki':
					return new Map();
				default:
					return state;
			}
		default:
			return state;
	}
};
