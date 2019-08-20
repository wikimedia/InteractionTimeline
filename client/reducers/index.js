function queryReducer( state, action ) {
	switch ( action.type ) {
		case 'QUERY_PARSED':
		case 'QUERY_UPDATE':
			return {
				...state,
				wiki: action.query.wiki || state.wiki,
				// Ensure there are no duplicates and that there are only 2.
				user: [ ...( new Set( action.query.user || state.user ) ) ].slice( 0, 2 ),
				startDate: action.query.startDate ?
					parseInt( action.query.startDate, 10 ) :
					state.startDate,
				endDate: action.query.endDate ?
					parseInt( action.query.endDate, 10 ) :
					state.endDate,
			};
		case 'QUERY_WIKI_CHANGE':
			return {
				...state,
				wiki: action.wiki,
			};
		case 'QUERY_USER_CHANGE':
			return {
				...state,
				// Ensure there are no duplicates and that there are only 2.
				user: [ ...( new Set( action.users ) ) ].slice( 0, 2 ),
			};
		case 'QUERY_START_DATE_CHANGE':
			return {
				...state,
				startDate: action.startDate,
			};
		case 'QUERY_END_DATE_CHANGE':
			return {
				...state,
				endDate: action.endDate,
			};
		default:
			return state;
	}
}

function queryParsedReducer( state, action ) {
	switch ( action.type ) {
		case 'QUERY_PARSED':
			return true;
		default:
			return state;
	}
}

function wikiReducer( state, action ) {
	switch ( action.type ) {
		case 'WIKIS_SET':
			return [
				...action.wikis.reduce( ( map, wiki ) => (
					map.set( wiki.id, wiki )
				), new Map() ).values(),
			];
		default:
			return state;
	}
}

function revisionsReducer( state, action ) {
	switch ( action.type ) {
		default:
			return state;
	}
}

function statusReducer( state, action ) {
	switch ( action.type ) {
		default:
			return state;
	}
}

function reducer( state, action ) {
	const query = queryReducer( state.query, action );
	const queryParsed = queryParsedReducer( state.queryParsed, action );
	const wikis = wikiReducer( state.wikis, action );
	const revisions = revisionsReducer( state.revisions, action );
	const status = statusReducer( state.status, action );

	// If anything changed, update the object.
	if (
		state.query !== query ||
		state.queryParsed !== queryParsed ||
		state.wikis !== wikis ||
		state.revisions !== revisions ||
		state.status !== status
	) {
		return {
			...state,
			query,
			queryParsed,
			wikis,
			revisions,
			status,
		};
	}

	return state;
}

export default reducer;
