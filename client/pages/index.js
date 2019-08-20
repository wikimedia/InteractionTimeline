import { useReducer } from 'react';
import PropTypes from 'prop-types';
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
	wikis: [],
};

function queryReducer( state, action ) {
	switch ( action.type ) {
		case 'QUERY_UPDATE':
			return {
				...state,
				wiki: action.query.wiki || state.wiki,
				// Ensure there are no duplicates and that there are only 2.
				user: [ ...( new Set( action.query.user || state.user ) ) ].slice( 0, 2 ),
				startDate: action.query.startDate || state.startDate,
				endDate: action.query.endDate || state.endDate,
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

	// If anything changed, update the object.
	if (
		state.query !== query ||
		state.wikis !== wikis
	) {
		return {
			...state,
			query,
			wikis,
		};
	}

	return state;
}

function Index( { initialState } ) {
	const [ state, dispatch ] = useReducer( reducer, initialState );

	// // Set default query on load.
	// useEffect( () => {

	// }, [] );

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

Index.getInitialProps = ( { query, req } ) => {
	if ( !req ) {
		return {};
	}

	// @TODO Get the Result when a query is present!.

	return {
		initialState: reducer( defaultState, { type: 'QUERY_UPDATE', query } ),
	};
};

Index.propTypes = {
	initialState: PropTypes.shape( {
		query: PropTypes.object,
		wikis: PropTypes.arrayOf( PropTypes.object ),
	} ),
};

Index.defaultProps = {
	initialState: defaultState,
};

export default Index;
