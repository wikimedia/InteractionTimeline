import { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import moment from 'moment';
import reducer from '../reducers/index';
import ReducerContext from '../context/reducer';
import Layout from '../components/layout';
import Form from '../components/form';
import TimelineContainer from '../components/timeline/timeline.container';

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
	status: 'notready',
	error: null,
};

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
						<TimelineContainer />
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
		revisions: PropTypes.arrayOf( PropTypes.object ),
		status: PropTypes.string,
	} ),
};

Index.defaultProps = {
	initialState: defaultState,
};

export default Index;
