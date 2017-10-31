import 'react-dates/initialize';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

class DatePicker extends React.Component {

	constructor( props ) {
		super( props );

		// Determine the end of day.
		this.eod = moment().endOf( 'day' );

		// UI state can be maintained within the component.
		this.state = {
			focus: null
		};

		// Binding
		this.initialVisibleMonth = this.initialVisibleMonth.bind( this );
		this.onFocusChange = this.onFocusChange.bind( this );
		this.onDateChange = this.onDateChange.bind( this );
		this.isOutsideRange = this.isOutsideRange.bind( this );
	}

	onFocusChange( focus ) {
		this.setState( {
			...this.state,
			focus: focus
		} );
	}

	onDateChange( { startDate, endDate } ) {
		if ( this.props.startDate !== startDate ) {
			this.props.onStartDateChange( startDate );
		}
		if ( this.props.endDate !== endDate ) {
			this.props.onEndDateChange( endDate );
		}

		this.setState( {
			...this.state,
			focus: null
		} );
	}

	isOutsideRange( date ) {
		return date.diff( this.eod ) > 0;
	}

	initialVisibleMonth() {
		return moment().subtract( 1, 'month' );
	}

	render() {
		const props = {
			...this.props
		};

		delete props.onStartDateChange;
		delete props.onEndDateChange;

		return (
			<DateRangePicker
				onDatesChange={this.onDateChange}
				focusedInput={this.state.focus}
				onFocusChange={this.onFocusChange}
				isOutsideRange={this.isOutsideRange}
				initialVisibleMonth={this.initialVisibleMonth}
				showClearDates
				{...props}
			/>
		);
	}
}

DatePicker.propTypes = {
	startDate: PropTypes.instanceOf( moment ),
	endDate: PropTypes.instanceOf( moment ),
	onStartDateChange: PropTypes.func.isRequired,
	onEndDateChange: PropTypes.func.isRequired
};

DatePicker.defaultProps = {
	startDate: undefined,
	endDate: undefined
};

export default DatePicker;
