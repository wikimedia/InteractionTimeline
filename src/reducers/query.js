import Query from 'app/entities/query';

export default ( state = new Query(), action ) => {
	switch ( action.type ) {
		case 'QUERY_UPDATE':
			return action.query;
		case 'QUERY_SET_VALUE':
			return state.set( action.key, action.value );
		default:
			return state;
	}
};
