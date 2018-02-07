import { Observable } from 'rxjs';
import * as RevisionActions from 'app/actions/revisions';

const buildDiffUrl = ( domain, id ) => {
	// The API only allows a single page lookup at a time.
	return `https://${domain}/w/api.php?action=compare&fromrev=${id}&torelative=prev&formatversion=2&format=json&origin=*&prop=diff`;
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
					// Merge the response with what is currently in the store
					// which may be different from what we started with.
					let diff = store.getState().revisions.list.get( action.id ).meta.diff;
					diff = diff.setIn( [ 'meta', 'status' ], 'done' );
					return Observable.of( RevisionActions.setDiff( action.id, diff.merge( ajaxResponse.response.compare ) ) );
				} );

			return Observable.concat(
				Observable.of( RevisionActions.setDiffStatus( action.id, 'fetching' ) ),
				request
			);
		} )
);
