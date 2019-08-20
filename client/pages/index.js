import { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import moment from 'moment';
import ReducerContext from '../context/reducer';
import Layout from '../components/layout';
import Form from '../components/form';

const defaultState = {
	query: {
		user: [],
		wiki: undefined,
		startDate: undefined,
		endDate: undefined,
	},
	queryParsed: false,
	wikis: [],
};

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

function reducer( state, action ) {
	const query = queryReducer( state.query, action );
	const wikis = wikiReducer( state.wikis, action );
	const queryParsed = queryParsedReducer( state.queryParsed, action );

	// If anything changed, update the object.
	if (
		state.query !== query ||
		state.queryParsed !== queryParsed ||
		state.wikis !== wikis
	) {
		return {
			...state,
			query,
			queryParsed,
			wikis,
		};
	}

	return state;
}

function Index( { initialState } ) {
	const [ state, dispatch ] = useReducer( reducer, initialState );

	// Set default query on load.
	useEffect( () => {
		/* global window */
		const url = new URL( window.location.href );

		const user = url.searchParams.getAll( 'user' );
		const wiki = url.searchParams.get( 'wiki' );
		const startDate = url.searchParams.get( 'startDate' );
		const endDate = url.searchParams.get( 'endDate' );
		const emptyQuery = user.length === 0 && !wiki && !startDate && !endDate;

		dispatch( {
			type: 'QUERY_PARSED',
			query: {
				user,
				wiki,
				// If the query is empty, set a default startDate.
				startDate: emptyQuery ? moment.utc().startOf( 'day' ).subtract( 30, 'days' ).unix() : startDate,
				endDate,
			},
		} );
	}, [] );

	// Push the query to the route.
	useEffect( () => {
		// If the query hasn't been initiall parsed yet, then skip updating until it has been.
		if ( !state.queryParsed ) {
			return;
		}

		// If the query is only a startDate, assume that it is the default and reumove the query.
		if (
			state.query.user.length === 0 &&
			!state.query.wiki &&
			!state.query.endDate
		) {
			Router.replace( '/' );
			return;
		}

		const searchParams = new URLSearchParams();
		state.query.user.forEach( ( user ) => searchParams.append( 'user', user ) );
		[ 'wiki', 'startDate', 'endDate' ].forEach( ( prop ) => {
			if ( state.query[ prop ] ) {
				searchParams.set( prop, state.query[ prop ] );
			}
		} );

		const search = searchParams.toString();

		const url = new URL( window.location.href );

		// If the current url matches the "updated" string, skip update.
		if ( url.searchParams.toString() === search ) {
			return;
		}

		Router.replace( search ? `/?${search}` : '/' );
	}, [
		state.queryParsed,
		state.query.user,
		state.query.wiki,
		state.query.startDate,
		state.query.endDate,
	] );

	return (
		<ReducerContext.Provider value={[ state, dispatch ]}>
			<Layout>
				<div className="row justify-content-center">
					<div className="col-xl-10 col-sm-8">
						<div className="row mb-3">
							<div className="col">
								<Form />
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col">
						{/* <TimelineContainer /> */}
					</div>
				</div>
			</Layout>
		</ReducerContext.Provider>
	);
}

// Uncomment these lines to enable server-side rendering.
// Index.getInitialProps = ( { query, req } ) => {
// 	if ( !req ) {
// 		return {};
// 	}

// 	// @TODO Get the Result when a query is present!.

// 	return {
// 		initialState: reducer( defaultState, { type: 'QUERY_UPDATE', query } ),
// 	};
// };

Index.propTypes = {
	initialState: PropTypes.shape( {
		query: PropTypes.object,
		queryParsed: PropTypes.bool,
		wikis: PropTypes.arrayOf( PropTypes.object ),
	} ),
};

Index.defaultProps = {
	initialState: defaultState,
};

export default Index;
