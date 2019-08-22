/**
 * Validate the query and update the status accordingly.
 *
 * @param {Object} state
 * @return {Object}
 */
function updateStatus( state ) {
	if ( state.error ) {
		return {
			...state,
			status: 'error',
		};
	}

	if ( !state.query.wiki && state.query.user.length < 2 ) {
		return {
			...state,
			status: 'notready',
		};
	}

	if ( state.query.wiki && state.query.user.length < 2 ) {
		return {
			...state,
			status: 'nousers',
		};
	}

	if ( !state.query.wiki && state.query.user.length >= 2 ) {
		return {
			...state,
			status: 'nowiki',
		};
	}

	if ( state.cont === false ) {
		if ( state.revisions.length === 0 ) {
			return {
				...state,
				status: 'noresults',
			};
		}

		return {
			...state,
			status: 'done',
		};
	}

	if ( state.cont !== null ) {
		return {
			...state,
			status: 'continue',
		};
	}

	return {
		...state,
		status: 'ready',
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
			return updateStatus( {
				...state,
				query: {
					...state.query,
					startDate: action.startDate,
				},
			} );
		case 'QUERY_END_DATE_CHANGE':
			return updateStatus( {
				...state,
				query: {
					...state.query,
					endDate: action.endDate,
				},
			} );
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
			return updateStatus( {
				...state,
				revisions: action.revisions,
				cont: action.cont,
			} );
		case 'REVISIONS_ADD':
			return updateStatus( {
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
			} );
		case 'STATUS_FETCHING':
			return {
				...state,
				status: 'fetching',
			};
		case 'ERROR':
			return updateStatus( {
				...state,
				error: action.error,
			} );
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
