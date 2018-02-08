/* eslint-env browser */
import { Observable } from 'rxjs';
import { OrderedMap } from 'immutable';
import Wiki from 'app/entities/wiki';
import * as WikiActions from 'app/actions/wiki';
import specialWikisList from 'app/utils/special-wikis-list';

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
					const wikis = Object.keys( ajaxResponse.response.sitematrix )
						.filter( ( key ) => {
							return ( !isNaN( parseFloat( key ) ) && isFinite( key ) );
						} )
						.map( ( key ) => {
							return ajaxResponse.response.sitematrix[ key ];
						} )
						.reduce( ( state, data ) => (
							[
								...state,
								...data.site.map( ( item ) => (
									{
										id: item.dbname,
										domain: new URL( item.url ).hostname,
										family: item.code,
										code: data.code
									}
								) )
							]
						), specialWikisList )
						.sort( ( a, b ) => {
							if ( a.code === b.code ) {
								// sorting wikis alphabetically by their 'code/family' with the exception of wiktionary
								// we want them right after wikipedias (wiki) in the second position.
								if ( a.family === 'wiktionary' && b.family !== 'wiki' ) {
									return -1;
								}

								if ( b.family === 'wiktionary' && a.family !== 'wiki' ) {
									return 1;
								}

								return ( a.family > b.family ) ? 1 : -1;
							}

							return ( a.code > b.code ) ? 1 : -1;
						} )
						.reduce( ( state, data ) => (
							state.set( data.id, new Wiki( { ...data } ) ) ), new OrderedMap()
						);

					return WikiActions.setWikis( wikis );
				} )
				.catch( () => Observable.of( WikiActions.setWikis( new OrderedMap() ) ) )
		) )
);

export default fetchAllWikis;
