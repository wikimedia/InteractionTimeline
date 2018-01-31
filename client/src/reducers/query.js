import Query from 'app/entities/query';

export default ( state = new Query(), action ) => {
	switch ( action.type ) {
		case 'QUERY_UPDATE':
			let query = action.query;

			if ( query.user ) {
				query = query.set( 'user', query.user.slice( 0, 2 ) );
			}

			return query;
		case 'QUERY_USER_CHANGE':
			return state.set( 'user', action.users );
		case 'QUERY_WIKI_CHANGE':
			return state.set( 'wiki', action.wiki );
		case 'QUERY_START_DATE_CHANGE':
			return state.set( 'startDate', action.startDate );
		case 'QUERY_END_DATE_CHANGE':
			return state.set( 'endDate', action.endDate );
		default:
			return state;
	}
};
