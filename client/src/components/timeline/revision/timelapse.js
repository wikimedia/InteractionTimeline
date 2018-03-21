import React from 'react';
import PropTypes from 'prop-types';
import Message from 'app/components/i18n/message';

const TimelineTimelapse = ( { date, samePage } ) => (
	<div className="col-md-6 small col-12 timelapse align-text-middle">
		<span><Message id={samePage ? 'between-interactions' : 'between-edits'} placeholders={[ date ]} /></span>
	</div>
);

TimelineTimelapse.propTypes = {
	date: PropTypes.string.isRequired,
	samePage: PropTypes.bool.isRequired
};

export default TimelineTimelapse;
