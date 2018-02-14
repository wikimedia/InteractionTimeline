import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class DatePicker extends React.Component {

	constructor( props ) {
		super( props );

		// Binding
		this.onChange = this.onChange.bind( this );
	}

	onChange( date ) {
		// Ensure that the date is a valid date object or an empty string.
		if ( date instanceof moment || !date ) {
			// Ensure that the date has actually changed.
			if ( this.props.value !== date ) {
				// If the date is a moment object and the component was provided a
				// function to validate the date, ensure the date is valid before
				// passing it upstream.
				if ( date instanceof moment && this.props.isValidDate ) {
					if ( this.props.isValidDate( date ) ) {
						return this.props.onChange( date );
					}
				} else {
					this.props.onChange( date );
				}
			}
		}
	}

	render() {
		return (
			<Datetime
				value={this.props.value}
				dateFormat="YYYY-MM-DD"
				onChange={this.onChange}
				isValidDate={this.props.isValidDate}
				inputProps={{
					placeholder: 'YYYY-MM-DD',
					id: this.props.id
				}}
				timeFormat={false}
				closeOnSelect
			/>
		);
	}
}

DatePicker.propTypes = {
	value: PropTypes.instanceOf( moment ),
	id: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	isValidDate: PropTypes.func
};

DatePicker.defaultProps = {
	value: undefined,
	id: undefined,
	isValidDate: undefined
};

export default DatePicker;
