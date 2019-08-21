function updateStatus( state ) {
	const ready = !!state.query.wiki && state.query.user.length >= 2;

	if ( ready && state.status === 'ready' ) {
		return state;
	}

	if ( !ready && state.status === 'notready' ) {
		return state;
	}

	return {
		...state,
		status: ready ? 'ready' : 'notready',
	};
}

function reducer( state, action ) {
	switch ( action.type ) {
		case 'QUERY_PARSED':
		case 'QUERY_UPDATE':
			return updateStatus( {
				...state,
				// If the query was parsed, set to true, otherwise leave the same as before.
				queryParsed: action.type === 'QUERY_PARSED' ? true : state.queryParsed,
				query: {
					...state.query,
					wiki: action.query.wiki || state.query.wiki,
					// Ensure there are no duplicates and that there are only 2.
					user: [ ...( new Set( action.query.user || state.query.user ) ) ].slice( 0, 2 ),
					startDate: action.query.startDate ?
						parseInt( action.query.startDate, 10 ) :
						state.query.startDate,
					endDate: action.query.endDate ?
						parseInt( action.query.endDate, 10 ) :
						state.query.endDate,
				},
			} );
		case 'QUERY_WIKI_CHANGE':
			return updateStatus( {
				...state,
				query: {
					...state.query,
					wiki: action.wiki,
				},
			} );
		case 'QUERY_USER_CHANGE':
			return updateStatus( {
				...state,
				query: {
					...state.query,
					// Ensure there are no duplicates and that there are only 2.
					user: [ ...( new Set( action.users ) ) ].slice( 0, 2 ),
				},
			} );
		case 'QUERY_START_DATE_CHANGE':
			return {
				...state,
				query: {
					...state.query,
					startDate: action.startDate,
				},
			};
		case 'QUERY_END_DATE_CHANGE':
			return {
				...state,
				query: {
					...state.query,
					endDate: action.endDate,
				},
			};
		case 'WIKIS_SET':
			return {
				...state,
				wikis: [
					...action.wikis.reduce( ( map, wiki ) => (
						map.set( wiki.id, wiki )
					), new Map() ).values(),
				],
			};
		case 'ERROR_CLEAR':
			return updateStatus( {
				...state,
				error: null,
			} );
		default:
			throw new Error( 'Unknown Action' );
	}
}

export default reducer;
