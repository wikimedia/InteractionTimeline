import { useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { timer } from 'rxjs';
import moment from 'moment';
import { Message } from '@wikimedia/react.i18n';
import DatePicker from './date-picker';

const initialState = {
	eod: 0,
};

function reducer( state, action ) {
	switch ( action.type ) {
		case 'SET_EOD':
			return {
				...state,
				eod: action.eod,
			};
		default:
			throw new Error( 'Unknown Action' );
	}
}

function DateRange( {
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
} ) {
	const [ state, dispatch ] = useReducer( reducer, initialState );

	const isValidDate = useCallback( ( date ) => date - state.eod < 0, [ state.eod ] );

	const isValidStartDate = useCallback( ( date ) => {
		if ( !endDate ) {
			return isValidDate( date );
		}

		if ( date - endDate > 0 ) {
			return false;
		}

		return isValidDate( date );
	}, [ endDate, isValidDate ] );

	const isValidEndDate = useCallback( ( date ) => {
		if ( !startDate ) {
			return isValidDate( date );
		}

		if ( date - startDate < 0 ) {
			return false;
		}

		return isValidDate( date );
	}, [ startDate, isValidDate ] );

	// Update "today" at midnight each day.
	useEffect( () => {
		const now = moment().utc();
		const obs = timer( now.clone().add( 1, 'day' ).startOf( 'day' ) - now, 24 * 60 * 60 * 1000 );

		// Update end of day now.
		dispatch( {
			type: 'SET_EOD',
			eod: moment().utc().endOf( 'day' ).unix(),
		} );

		// Update end of day tomorrow.
		const sub = obs.subscribe( () => {
			dispatch( {
				type: 'SET_EOD',
				eod: moment().utc().endOf( 'day' ).unix(),
			} );
		} );

		return () => sub.unsubscribe();
	}, [] );

	return (
		<div className="form-group row align-items-center">
			<label className="col-form-label" htmlFor="input-start-date"><Message id="field-label-start-date" /></label>
			<div className="col">
				<DatePicker
					value={startDate}
					id="input-start-date"
					onChange={onStartDateChange}
					isValidDate={isValidStartDate}
				/>
			</div>
			<label className="col-form-label" htmlFor="input-end-date"><Message id="field-label-end-date" /></label>
			<div className="col">
				<DatePicker
					value={endDate}
					id="input-end-date"
					onChange={onEndDateChange}
					isValidDate={isValidEndDate}
				/>
			</div>
		</div>
	);
}

DateRange.propTypes = {
	startDate: PropTypes.number,
	endDate: PropTypes.number,
	onStartDateChange: PropTypes.func.isRequired,
	onEndDateChange: PropTypes.func.isRequired,
};

DateRange.defaultProps = {
	startDate: undefined,
	endDate: undefined,
};

export default DateRange;
