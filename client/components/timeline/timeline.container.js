import { useContext } from 'react';
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

// @TODO Update this to work with pagination.... ?
function interactionReactor( input$ ) {
	return input$.pipe(
		// Validate that the query has everything needed.
		filter( ( { user, wiki } ) => !!wiki && user.length >= 2 ),
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
					type: 'STATUS_FETCHING',
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
						filter( ( { status } ) => status !== 'fetching' )
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
			] ) => of( {
				user,
				wiki,
				startDate,
				endDate,
			} ) )
		) )
	), dispatch, [
		state.query.user,
		state.query.wiki,
		state.query.startDate,
		state.query.endDate,
	] );

	console.log('EMPTY', state.revisions.length === 0);
	console.log('STATUS', state.status);

	return (
		<Timeline
			empty={state.revisions.length === 0}
			status={state.status}
		/>
	);
}

export default TimelineContainer;
