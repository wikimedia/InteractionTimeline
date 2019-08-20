import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

function DatePicker( {
	isValidDate,
	onChange,
	value,
	id,
} ) {
	const mValue = useMemo( () => ( value ? moment.unix( value ).utc() : undefined ), [ value ] );

	const isDateValid = useCallback( ( date ) => isValidDate( date.unix() ), [ isValidDate ] );

	const onDateChange = useCallback( ( date ) => {
		// Ensure that the date is a valid date object or an empty string.
		if ( date instanceof moment || !date ) {
			// Ensure that the date has actually changed.
			if ( mValue !== date ) {
				// If the date is a moment object and the component was provided a
				// function to validate the date, ensure the date is valid before
				// passing it upstream.
				if ( date instanceof moment && isValidDate ) {
					if ( isValidDate( date.unix() ) ) {
						return onChange( date.unix() );
					}
				} else {
					return onChange( date ? date.unix() : undefined );
				}
			}
		}

		return date;
	}, [ mValue, isValidDate, onChange ] );

	return (
		<Datetime
			value={mValue}
			dateFormat="YYYY-MM-DD"
			onChange={onDateChange}
			isValidDate={isDateValid}
			inputProps={{
				placeholder: 'YYYY-MM-DD',
				id,
			}}
			timeFormat={false}
			utc
			closeOnSelect
		/>
	);
}

DatePicker.propTypes = {
	value: PropTypes.number,
	id: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	isValidDate: PropTypes.func,
};

DatePicker.defaultProps = {
	value: undefined,
	id: undefined,
	isValidDate: undefined,
};

export default DatePicker;
