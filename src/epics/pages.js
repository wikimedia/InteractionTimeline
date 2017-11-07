import { Observable } from 'rxjs';
import { Map } from 'immutable';
import * as PagesActions from 'app/actions/pages';
import Page from 'app/entities/page';

const buildUrl = ( domain, user, cont ) => {
	let url = 'https://' + domain + '/w/api.php?action=query&generator=allrevisions&garvlimit=500&origin=*&format=json&formatversion=2';

	if ( user ) {
		url += '&garvuser=' + user;
	}

	if ( cont ) {
		url += '&garvcontinue=' + cont;
	}

	return url;
};

const pageRequest = ( domain, user, cont ) => {
	return Observable.ajax( {
		url: buildUrl( domain, user, cont ),
		crossDomain: true,
		responseType: 'json'
	} )
		.flatMap( ( ajaxResponse ) => {
			// User has no pages.
			if ( !ajaxResponse.response.query ) {
				return Observable.of( PagesActions.mergeUserPages( user, new Map() ) );
			}

			const pages =
				new Map(
					ajaxResponse.response.query.pages.map( ( data ) => (
						[
							data.pageid,
							new Page( {
								id: data.pageid,
								...data
							} )
						]
					) )
				);

			if ( ajaxResponse.response.continue && ajaxResponse.response.continue.garvcontinue ) {
				return Observable.concat(
					Observable.of( PagesActions.mergeUserPages( user, pages ) ),
					Observable.of( PagesActions.fetchUserPagesContinue( domain, user, ajaxResponse.response.continue.garvcontinue ) )
				);
			}

			return Observable.of( PagesActions.mergeUserPages( user, pages ) );
		} );
};

export const fetchPages = ( action$, store ) => (
	action$
		.filter( ( action ) => [ 'QUERY_UPDATE', 'QUERY_SET_VALUE', 'WIKIS_SET' ].includes( action.type ) )
		// Ensure that all the necessary data is present.
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 && store.getState().query.user.size > 0 )
		.distinctUntilChanged( () => store.getState().query.user )
		.switchMap( () => Observable.from( store.getState().query.user.toArray() ) )
		.filter( ( user ) => !store.getState().pages.has( user ) )
		.flatMap( ( user ) => pageRequest( store.getState().wikis.get( store.getState().query.wiki ).domain, user ) )
);

export const fetchPagesContinue = ( action$, store ) => (
	action$
		.ofType( 'PAGES_FETCH_CONTINUE' )
		// If all of the necessary values are not present, stop retrieving the pages.
		.filter( () => !!store.getState().query.wiki && store.getState().wikis.size > 0 && store.getState().query.user.size > 0 )
		// If the user is no longer in the query, stop retrieving the pages.
		.filter( ( action ) => store.getState().query.user.has( action.user ) )
		// If the wiki domain has changed, stop retrieving the pages.
		.filter( ( action ) => store.getState().wikis.get( store.getState().query.wiki ).domain === action.domain )
		.flatMap( ( action ) => pageRequest( action.domain, action.user, action.cont ) )
);
