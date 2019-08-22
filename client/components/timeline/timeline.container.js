import { useContext } from 'react';
import { of, concat } from 'rxjs';
import { flatMap, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import useReactor from '@cinematix/reactor';
import ReducerContext from '../../context/reducer';
import Timeline from './timeline';
import { ajax } from 'rxjs/ajax';

function interactionReactor( input$ ) {
	return input$.pipe(
		filter( ( { status, cont } ) => status === 'ready' && cont !== false ),
		distinctUntilChanged( ( x, y ) => (
			x.status === y.status &&
			x.user.length === y.user.length &&
			x.user[ 0 ] === y.user[ 0 ] &&
			x.user[ 1 ] === y.user[ 1 ] &&
			x.wiki === y.wiki &&
			x.startDate === y.startDate &&
			x.endDate === y.endDate &&
			x.cont === y.cont
		) ),
		// If a new fetch is recieved, cancel the old one. We should be careful
		// to not invoke multiple identical requests.
		switchMap( ( { wiki, user, startDate, endDate, cont } ) => {
			// The | character is not URL safe, so URLSearchParams encodes it. :/
			// Setting it directly on the url resolves the problem.
			const users = user.map( ( u ) => encodeURIComponent( u ) ).join( '|' );
			// @TODO Customize the URL!
			const url = new URL( `https://tools.wmflabs.org/interaction-timeline/api/${wiki}/interaction?user=${users}` );

			if ( startDate ) {
				url.searchParams.set( 'start_date', startDate );
			}
			if ( endDate ) {
				url.searchParams.set( 'end_date', endDate );
			}
			if ( cont ) {
				url.searchParams.set( 'continue', cont );
			}

			return concat(
				of( {
					type: 'STATUS_FETCHING',
				} ),
				ajax.getJSON( url.toString() ).pipe(
					tap( ( data ) => console.log( data ) )
				)
			);
		} ),
	);
}

function TimelineContainer() {
	const [ state, dispatch ] = useContext( ReducerContext );

	useReactor( ( input$ ) => (
		interactionReactor( input$.pipe(
			// Convert the array into an object.
			flatMap( ( [
				status,
				user,
				wiki,
				startDate,
				endDate,
				cont,
			] ) => of( {
				status,
				user,
				wiki,
				startDate,
				endDate,
				cont,
			} ) )
		) )
	), dispatch, [
		state.status,
		state.query.user,
		state.query.wiki,
		state.query.startDate,
		state.query.endDate,
		state.cont,
	] );

	return (
		<Timeline
			empty={state.revisions.length === 0}
			status={state.status}
		/>
	);
}

export default TimelineContainer;
