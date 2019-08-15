import { useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Message } from '@wikimedia/react.i18n';
import {
	of,
	concat,
} from 'rxjs';
import {
	switchMap,
	distinctUntilChanged,
	catchError,
	debounceTime,
	map,
	filter,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import useReactor from '@cinematix/reactor';
import { isIPAddress } from '../../utils/ip-validator';

function getOptionsFromUsernames( usernames = [] ) {
	if ( !usernames ) {
		return [];
	}

	// Remove any duplicates.
	const list = [ ...( new Set( usernames ) ) ];

	return list.filter( ( username ) => !!username ).map( ( username ) => ( {
		label: username,
		value: username,
	} ) );
}

function getUsernamesFromOptions( options ) {
	if ( !options ) {
		return [];
	}

	return options.filter( ( option ) => !!option ).map( ( { value } ) => value );
}

function ucFirst( str ) {
	if ( str.length === 0 ) {
		return str;
	}

	return str.charAt( 0 ).toUpperCase() + str.substr( 1 );
}

const initialState = {
	results: [],
	loading: false,
};

function reducer( state, action ) {
	switch ( action.type ) {
		case 'RESULTS':
			return {
				...state,
				loading: false,
				results: action.results,
			};
		case 'LOADING':
			return {
				...state,
				loading: true,
			};
		default:
			throw new Error( 'Unknown Action' );
	}
}

function userSearch( input$ ) {
	return input$.pipe(
		distinctUntilChanged( ( x, y ) => x === y ),
		filter( ( v ) => !!v ),
		debounceTime( 250 ),
		switchMap( ( input ) => {
			const value = input.trim();

			if ( isIPAddress( value ) ) {
				return of( {
					type: 'RESULTS',
					results: [
						{
							label: value,
							value,
						},
					],
				} );
			}

			const url = new URL( 'https://meta.wikimedia.org/w/api.php' );
			url.searchParams.set( 'action', 'query' );
			url.searchParams.set( 'format', 'json' );
			url.searchParams.set( 'list', 'globalallusers' );
			url.searchParams.set( 'origin', '*' );
			url.searchParams.set( 'origin', '*' );
			url.searchParams.set( 'agufrom', ucFirst( value ) );

			return concat(
				of( { type: 'LOADING' } ),
				ajax.getJSON( url.toString() ).pipe(
					map( ( { query } ) => {
						if ( !query ) {
							return {
								type: 'RESULTS',
								results: [],
							};
						}

						const results = query.globalallusers.map( ( { name } ) => name );

						return {
							type: 'RESULTS',
							results,
						};
					} ),
					catchError( () => {
						return {
							type: 'RESULTS',
							results: [],
						};
					} ),
				),
			);
		} ),
	);
}

function SelectUsers( props ) {
	const { value, onChange } = props;

	const [ state, dispatch ] = useReducer( reducer, initialState );

	const search = useReactor( userSearch, dispatch );

	const onInputChange = useCallback( ( input ) => search.next( input ), [] );

	const valueOptions = useMemo( () => getOptionsFromUsernames( value ), [ value ] );

	const options = useMemo(
		() => getOptionsFromUsernames( [ ...value, ...state.results ] ),
		[ value, state.results ],
	);

	const onValueChange = useCallback(
		( v ) => onChange( getUsernamesFromOptions( v ) ),
		[ onChange ],
	);

	return (
		<div className="select-users">
			<Select
				{...props} // eslint-disable-line react/jsx-props-no-spreading
				placeholder={<Message id="field-select-placeholder" />}
				noResultsText={<Message id="field-select-no-results" />}
				searchPromptText={<Message id="field-select-search-prompt" />}
				value={valueOptions}
				isMulti
				isLoading={state.loading}
				options={options}
				onInputChange={onInputChange}
				onChange={onValueChange}
				openOnClick={value.length < 2}
			/>
		</div>
	);
};

SelectUsers.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.arrayOf( PropTypes.string )
};

SelectUsers.defaultProps = {
	value: []
};

export default SelectUsers;
