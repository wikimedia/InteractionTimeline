import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineTimelapse = ( { date } ) => (
	<div className="col-md-6 col-12 pb-1 pt-1 box text-center align-text-middle">
		<div className="d-flex justify-content-center align-items-center">
			<i className="mr-2 material-icons">timelapse</i>
			{/* @TODO Translate "between interactions" */}
			<span>{date} between interactions</span>
		</div>
	</div>
);

TimelineTimelapse.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineTimelapse;
