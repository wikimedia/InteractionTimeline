import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Subject, Observable } from 'rxjs';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'react-select/dist/react-select.css';

class SelectUsers extends React.Component {

	constructor( props ) {
		super( props );
		this.textChange = new Subject();

		// Binding
		this.onInputChange = this.onInputChange.bind( this );
		this.onChange = this.onChange.bind( this );

		// This components state should be self contained.
		this.state = {
			value: this.getOptionsFromUsernames( props.value ),
			options: this.getOptionsFromUsernames( props.value ),
			loading: false
		};

		// Text Change Handler.
		this.textChange
			.distinctUntilChanged()
			.filter( input => !!input )
			.debounceTime( 250 )
			.switchMap( ( input ) => {
				// Set the loading state.
				this.setState( {
					...this.state,
					loading: true
				} );

				// Query for the users.
				return Observable.ajax( {
					url: 'https://meta.wikimedia.org/w/api.php?action=query&format=json&list=globalallusers&origin=*&agufrom=' + encodeURIComponent( this.ucFirst( input ) ),
					crossDomain: true
				} )
					.map( ( ajaxResponse ) => {
						return ajaxResponse.response.query.globalallusers.map( ( user ) => {
							return {
								label: user.name,
								value: user.name
							};
						} );
					} )
					.catch( () => {
						return [];
					} );
			} )
			.subscribe( ( options ) => {
				// Set the internal state.
				this.setState( {
					...this.state,
					loading: false,
					options: [
						...options
					]
				} );
			} );
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			...this.state,
			value: this.getOptionsFromUsernames( nextProps.value )
		} );
	}

	onInputChange( input ) {
		// Don't allow more than 2 users.
		if ( this.props.value.length === 2 ) {
			return '';
		}

		this.textChange.next( input );
		return input;
	}

	onChange( value ) {
		// Set the internal state.
		this.setState( {
			...this.state,
			value: value
		} );

		// Send the value upstream.
		this.props.onChange( this.getUsernamesFromOptions( value ) );
	}

	getUsernamesFromOptions( options ) {
		if ( !options ) {
			return [];
		}

		return options.map( this.getUsernameFromOption );
	}

	getUsernameFromOption( option ) {
		if ( !option ) {
			return undefined;
		}

		return option.value;
	}

	getOptionFromUsername( username ) {
		if ( !username ) {
			return {};
		}

		return {
			label: username,
			value: username
		};
	}

	getOptionsFromUsernames( usernames ) {
		if ( !usernames ) {
			return [];
		}

		return usernames.map( this.getOptionFromUsername );
	}

	ucFirst( str ) {
		if ( str.length > 0 ) {
			str = str.charAt( 0 ).toUpperCase() + str.substr( 1 );
		}

		return str;
	}

	render() {
		return (
			<div className="select-users">
				<Select
					{...this.props}
					value={this.state.value}
					multi
					isLoading={this.state.loading}
					options={this.state.options}
					onInputChange={this.onInputChange}
					onChange={this.onChange}
					openOnClick={this.props.value < 2}
				/>
			</div>
		);
	}
}

SelectUsers.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.arrayOf( PropTypes.string )
};

SelectUsers.defaultProps = {
	value: []
};

export default SelectUsers;
