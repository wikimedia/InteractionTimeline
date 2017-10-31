/* eslint-env browser */
import { Observable } from 'rxjs';
import { Map } from 'immutable';
import Wiki from 'app/entities/wiki';
import * as WikiActions from 'app/actions/wiki';

const fetchAllWikis = ( action$ ) => (
	action$.ofType( 'WIKI_LIST_FETCH' )
		.first()
		.flatMap( () => (
			Observable.ajax( {
				url: 'https://meta.wikimedia.org/w/api.php?action=sitematrix&format=json&origin=*',
				crossDomain: true,
				responseType: 'json'
			} )
				.map( ( ajaxResponse ) => {
					const wikis = Object.keys( ajaxResponse.response.sitematrix ).filter( ( key ) => {
						return ( !isNaN( parseFloat( key ) ) && isFinite( key ) ) || key === 'specials';
					} )
						.map( ( key ) => {
							// Special is different for some reason.
							if ( key === 'specials' ) {
								return {
									site: ajaxResponse.response.sitematrix[ key ]
								};
							}

							return ajaxResponse.response.sitematrix[ key ];
						} )
						.reduce( ( state, data ) => (
							[
								...state,
								...data.site.map( ( item ) => (
									new Wiki( {
										id: item.dbname,
										name: item.sitename,
										domain: new URL( item.url ).hostname
									} )
								) )
							]
						), [] )
						.reduce( ( state, data ) => ( state.set( data.id, data ) ), new Map() );
					return WikiActions.setWikis( wikis );
				} )
				.catch( () => Observable.of( WikiActions.setWikis( new Map() ) ) )
		) )
);

export default fetchAllWikis;
