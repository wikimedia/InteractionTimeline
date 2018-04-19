import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineDate = ( { date } ) => (
	<div className="row mb-1">
		<div className="col-12 date pt-3">
			<h4>{date}</h4>
		</div>
	</div>
);

TimelineDate.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineDate;
