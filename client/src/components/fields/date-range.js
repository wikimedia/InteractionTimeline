import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from './date-picker';

class DateRange extends React.Component {

	constructor( props ) {
		super( props );

		// Determine the end of day.
		this.eod = moment().utc().endOf( 'day' );

		// Binding
		this.isValidDate = this.isValidDate.bind( this );
		this.isValidStartDate = this.isValidStartDate.bind( this );
		this.isValidEndDate = this.isValidEndDate.bind( this );
	}

	isValidDate( date ) {
		return date.diff( this.eod ) < 0;
	}

	isValidStartDate( date ) {
		if ( !this.props.endDate ) {
			return this.isValidDate( date );
		}

		if ( date.diff( this.props.endDate ) > 0 ) {
			return false;
		}

		return this.isValidDate( date );
	}

	isValidEndDate( date ) {
		if ( !this.props.startDate ) {
			return this.isValidDate( date );
		}

		if ( date.diff( this.props.startDate ) < 0 ) {
			return false;
		}

		return this.isValidDate( date );
	}

	render() {
		return (
			<div className="form-group row align-items-center">
				<label className="col-form-label" htmlFor="input-start-date">Start Date</label>
				<div className="col">
					<DatePicker
						value={this.props.startDate}
						id="input-start-date"
						onChange={this.props.onStartDateChange}
						isValidDate={this.isValidStartDate}
					/>
				</div>
				<label className="col-form-label" htmlFor="input-end-date">End Date</label>
				<div className="col">
					<DatePicker
						value={this.props.endDate}
						id="input-end-date"
						onChange={this.props.onEndDateChange}
						isValidDate={this.isValidEndDate}
					/>
				</div>
			</div>
		);
	}
}

DateRange.propTypes = {
	startDate: PropTypes.instanceOf( moment ),
	endDate: PropTypes.instanceOf( moment ),
	onStartDateChange: PropTypes.func.isRequired,
	onEndDateChange: PropTypes.func.isRequired
};

DateRange.defaultProps = {
	startDate: undefined,
	endDate: undefined
};

export default DateRange;
