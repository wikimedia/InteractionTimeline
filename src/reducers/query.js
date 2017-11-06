import Query from 'app/entities/query';

export default ( state = new Query(), action ) => {
	switch ( action.type ) {
		case 'QUERY_UPDATE':
			let query = action.query;

			if ( query.user ) {
				query = query.set( 'user', query.user.slice( 0, 2 ) );
			}

			return query;
		case 'QUERY_SET_VALUE':
			let value = action.value;

			if ( action.key === 'user' ) {
				value = value.slice( 0, 2 );
			}

			return state.set( action.key, value );
		default:
			return state;
	}
};
