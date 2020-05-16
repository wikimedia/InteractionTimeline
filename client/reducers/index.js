const defaultState = {
	query: {
		user: [],
		wiki: undefined,
		startDate: undefined,
		endDate: undefined,
	},
	queryParsed: false,
	wikis: [],
	revisions: [],
	cont: null,
	loading: false,
	error: null,
};

function reducer( state, action ) {
	switch ( action.type ) {
		case 'QUERY_PARSED':
		case 'QUERY_UPDATE':
			return {
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
				error: null,
			};
		case 'QUERY_WIKI_CHANGE':
			return {
				...state,
				query: {
					...state.query,
					wiki: action.wiki,
				},
				error: null,
			};
		case 'QUERY_USER_CHANGE':
			return {
				...state,
				query: {
					...state.query,
					// Ensure there are no duplicates and that there are only 2.
					user: [ ...( new Set( action.users ) ) ].slice( 0, 2 ),
				},
				error: null,
			};
		case 'QUERY_START_DATE_CHANGE':
			return {
				...state,
				query: {
					...state.query,
					startDate: action.startDate,
				},
				error: null,
			};
		case 'QUERY_END_DATE_CHANGE':
			return {
				...state,
				query: {
					...state.query,
					endDate: action.endDate,
				},
				error: null,
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
		case 'REVISIONS_SET':
			return {
				...state,
				revisions: action.revisions,
				cont: action.cont,
				loading: false,
			};
		case 'REVISIONS_ADD':
			return {
				...state,
				revisions: [
					// Merge the arrays.
					...[
						...state.revisions,
						...action.revisions,
					]
						// Remove any duplicates.
						.reduce( ( map, revision ) => (
							map.set( revision.id, revision )
						), new Map() ).entries(),
				]
					// Sort by id.
					.sort( ( a, b ) => a.id - b.id ),
				cont: action.cont,
				loading: false,
			};
		case 'LOADING':
			return {
				...state,
				loading: true,
			};
		case 'ERROR':
			return {
				...state,
				loading: false,
				error: action.error,
			};
		case 'ERROR_CLEAR':
			return {
				...state,
				error: null,
			};
		default:
			throw new Error( 'Unknown Action' );
	}
}

export { reducer, defaultState };
