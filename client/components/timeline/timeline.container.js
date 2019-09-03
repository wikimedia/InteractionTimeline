import { useContext, useCallback, useMemo } from 'react';
import { of, concat } from 'rxjs';
import {
	flatMap,
	distinctUntilChanged,
	filter,
	switchMap,
	map,
	takeUntil,
	catchError,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import useReactor from '@cinematix/reactor';
import ReducerContext from '../../context/reducer';
import Timeline from './timeline';
import { start } from 'repl';

// @TODO Update this to work with pagination.... ?
function interactionReactor( input$ ) {
	return input$.pipe(
		// Ensure that this isn't the exact same request as the previous one.
		distinctUntilChanged( ( x, y ) => (
			x.user.length === y.user.length &&
			x.user[ 0 ] === y.user[ 0 ] &&
			x.user[ 1 ] === y.user[ 1 ] &&
			x.wiki === y.wiki &&
			x.startDate === y.startDate &&
			x.endDate === y.endDate &&
			x.cont === y.cont &&
			x.hasError === y.hasError
		) ),
		// Validate that the query has everything needed.
		filter( ( { user, wiki, hasError } ) => !hasError && !!wiki && user.length >= 2 ),
		// If a new fetch is recieved, cancel the old one. We should be careful
		// to not invoke multiple identical requests.
		switchMap( ( {
			wiki,
			user,
			startDate,
			endDate,
			cont,
		} ) => {
			// The | character is not URL safe, so URLSearchParams encodes it. :/
			// Setting it directly on the url resolves the problem.
			const users = user.map( ( u ) => encodeURIComponent( u ) ).join( '|' );
			const searchParams = new URLSearchParams();
			if ( startDate ) {
				searchParams.set( 'start_date', startDate );
			}
			if ( endDate ) {
				searchParams.set( 'end_date', endDate );
			}
			if ( cont ) {
				searchParams.set( 'continue', cont );
			}

			const extraParams = searchParams.toString();
			const url = `${process.env.PUBLIC_PATH}api/${wiki}/interaction?user=${users}${extraParams ? `&${extraParams}` : ''}`;

			return concat(
				of( {
					type: 'LOADING',
				} ),
				ajax.getJSON( url ).pipe(
					map( ( { data: contribs, continue: nextCont } ) => {
						// If the response is empty, we're done.
						if ( !contribs || contribs.length === 0 ) {
							return {
								type: 'REVISIONS_ADD',
								revisions: [],
								cont: nextCont || false,
							};
						}

						const revisions = contribs.map( ( data ) => (
							{
								id: data.rev_id,
								pageId: data.page_id,
								pageNamespace: data.page_namespace,
								title: data.page_title,
								sizeDiff: data.size_diff,
								commentHidden: data.comment_hidden,
								timestamp: data.timestamp,
							}
						) );

						return {
							// If we didn't use a continue,
							// this is the first page and the revisions should be reset.
							type: cont ? 'REVISIONS_ADD' : 'REVISIONS_SET',
							revisions,
							cont: nextCont || false,
						};
					} ),
					// If the query is no longer valid, cancel the request.
					takeUntil( input$.pipe(
						filter( ( data ) => !data.wiki || data.user.length < 2 )
					) ),
					catchError( ( error ) => of( {
						type: 'ERROR',
						error,
					} ) ),
				),
			);
		} ),
	);
}

function TimelineContainer() {
	const [ state, dispatch ] = useContext( ReducerContext );

	// Get the initial set of interactions when the query changes.
	useReactor( ( input$ ) => (
		interactionReactor( input$.pipe(
			// Convert the array into an object.
			// The continue will be undefined because this is the first page.
			flatMap( ( [
				user,
				wiki,
				startDate,
				endDate,
				hasError,
			] ) => of( {
				user,
				wiki,
				startDate,
				endDate,
				hasError,
			} ) )
		) )
	), dispatch, [
		state.query.user,
		state.query.wiki,
		state.query.startDate,
		state.query.endDate,
		!!state.error,
	] );

	const interactionFetcher = useReactor( interactionReactor, dispatch );

	const fetchList = useCallback( () => {
		interactionFetcher.next( {
			user: state.query.user,
			wiki: state.query.wiki,
			startDate: state.query.startDate,
			endDate: start.query.endDate,
			cont: state.cont,
			hasError: !!state.error,
		} );
	}, [
		state.query.user,
		state.query.wiki,
		state.query.startDate,
		start.query.endDate,
		state.cont,
		!!state.error,
	]);

	// Status derived from the state.
	const status = useMemo( () => {
		if ( state.error ) {
			return 'error';
		}

		if ( state.loading ) {
			return 'fetching';
		}

		if ( !state.query.wiki && state.query.user.length < 2 ) {
			return 'notready';
		}

		if ( state.query.wiki && state.query.user.length < 2 ) {
			return 'nousers';
		}

		if ( !state.query.wiki && state.query.user.length >= 2 ) {
			return 'nowiki';
		}

		if ( state.cont === false && state.revisions.length === 0 ) {
			return 'noresults';
		}

		if ( state.cont === false ) {
			return 'done';
		}

		return 'ready';
	}, [
		state.error,
		state.loading,
		state.query.wiki,
		state.query.user,
		state.cont,
		state.revisions,
	] );

	return (
		<Timeline
			empty={state.revisions.length === 0}
			status={status}
			fetchList={fetchList}
		/>
	);
}

export default TimelineContainer;
