import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineDate = ( { date } ) => (
	<div className="row mb-1">
		<div className="col-10 pb-2 pt-2 border rounded text-center align-text-middle">
			<div className="d-flex justify-content-center align-items-center">
				<i className="mr-2 material-icons md-48">today</i>
				<span>{date}</span>
			</div>
		</div>
	</div>
);

TimelineDate.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineDate;
