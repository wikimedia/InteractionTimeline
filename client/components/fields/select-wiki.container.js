import { useContext, useCallback, useEffect } from 'react';
import reducer from '../../context/reducer';
import SelectWiki from './select-wiki';
import specialWikisList from '../../utils/special-wikis-list';

async function fetchWikiList() {
	const url = new URL( 'https://meta.wikimedia.org/w/api.php' );
	url.searchParams.set( 'action', 'sitematrix' );
	url.searchParams.set( 'format', 'json' );
	url.searchParams.set( 'origin', '*' );

	const response = await fetch( url );
	const data = await response.json();

	return Object.keys( data.sitematrix )
		.filter( ( key ) => ( !isNaN( parseFloat( key ) ) && isFinite( key ) ) )
		.map( ( key ) => data.sitematrix[ key ] )
		.reduce( ( state, group ) => (
			[
				...state,
				...group.site.map( ( item ) => (
					{
						id: item.dbname,
						domain: new URL( item.url ).hostname,
						family: item.code,
						code: group.code
					}
				) )
			]
		), specialWikisList )
		.sort( ( a, b ) => {
			if ( a.code === b.code ) {
				// sorting wikis alphabetically by their 'code/family'
				// with the exception of wiktionary
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
		} );
}

function SelectWikiContainer( props ) {
	const [ state, dispatch ] = useContext( reducer );

	useEffect( () => {
		fetchWikiList().then( ( wikis ) => dispatch( {
			type: 'WIKIS_SET',
			wikis,
		} ) );
	}, [] );

	const onChange = useCallback( ( wiki ) => dispatch( { type: 'QUERY_WIKI_CHANGE', wiki } ) );

	return (
		<SelectWiki
			{...props} // eslint-disable-line react/jsx-props-no-spreading
			value={state.query.wiki}
			isLoading={!state.wikis.length}
			wikis={state.wikis}
			onChange={onChange}
		/>
	);
}

export default SelectWikiContainer;
