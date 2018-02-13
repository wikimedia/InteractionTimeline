import { Observable, AjaxError } from 'rxjs';
import Diff from 'app/entities/diff';
import * as RevisionActions from 'app/actions/revisions';

const buildDiffUrl = ( domain, id ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=compare&fromrev=${id}&torelative=prev&formatversion=2&format=json&origin=*&prop=diff|user|ids`;
};

export const fetchDiff = ( action$, store ) => (
	action$.ofType( 'REVISIONS_DIFF_SHOW_SET' )
		.filter( ( action ) => action.show === true )
		.filter( ( action ) => action.status === 'ready' )
		.flatMap( ( action ) => {
			// Set the variables so the request can be canceled if the state
			// changes.
			const wiki = store.getState().query.wiki;
			const domain = store.getState().wikis.get( wiki ).domain;

			const request = Observable.ajax( {
				url: buildDiffUrl( domain, action.id ),
				crossDomain: true,
				responseType: 'json'
			} )
				.flatMap( ( ajaxResponse ) => {
					if ( ajaxResponse.response.error ) {
						throw new AjaxError(
							ajaxResponse.response.error.info,
							ajaxResponse.xhr,
							ajaxResponse.request
						);
					}

					// Merge the response with what is currently in the store
					// which may be different from what we started with.
					const meta = store.getState().revisions.list.get( action.id ).meta.diff.meta;
					const diff = new Diff( {
						...ajaxResponse.response.compare,
						meta: meta.set( 'status', 'done' )
					} );
					return Observable.of( RevisionActions.setDiff( action.id, diff ) );
				} )
				// If the user is no longer in the query, ensure that the revision still
				// exits, if it doesn't, cancel the request.
				.takeUntil( action$.ofType( 'QUERY_USER_CHANGE' ).filter( () => !store.getState().revisions.list.has( action.id ) ) )
				// If the wiki changes, cancel the request.
				.takeUntil( action$.ofType( 'QUERY_WIKI_CHANGE' ).filter( a => a.wiki !== wiki ) )
				// If the revision was deleted, cancel the request.
				.takeUntil( action$.ofType( 'REVISIONS_DELETE' ).filter( a => a.revisions.has( action.id ) ) )
				.catch( ( error ) => Observable.of( RevisionActions.throwDiffError( action.id, error ) ) );

			return Observable.concat(
				Observable.of( RevisionActions.setDiffStatus( action.id, 'fetching' ) ),
				request
			);
		} )
);
