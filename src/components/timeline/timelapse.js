import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineTimelapse = ( { date } ) => (
	<div className="col-md-6 small col-12 timelapse align-text-middle">
	{/* @TODO Translate "between interactions" */}
	<span>{date} between interactions</span>
	</div>
);

TimelineTimelapse.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineTimelapse;
