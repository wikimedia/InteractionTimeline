import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'PAGES_SET_USER_PAGES':
			return state.set( action.user, action.pages );
		case 'PAGES_MERGE_USER_PAGES':
			let pages = state.get( action.user );
			if ( pages ) {
				pages = pages.merge( action.pages );
			} else {
				pages = action.pages;
			}

			return state.set( action.user, pages );
		case 'QUERY_SET_VALUE':
			switch ( action.key ) {
				case 'user':
					return state.filter( ( value, key ) => !!action.value.get( key ) );
				case 'wiki':
					return new Map();
				default:
					return state;
			}
		case 'QUERY_UPDATE':
			return state.filter( ( value, key ) => !!action.query.user.has( key ) );
		default:
			return state;
	}
};
