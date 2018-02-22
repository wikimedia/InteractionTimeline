import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineDate = ( { date } ) => (
	<div className="row mb-1">
		<div className="col-10 pb-1 pt-1 border rounded text-center align-text-middle">
			<div className="d-flex justify-content-center align-items-center text-nowrap">
				<span>{date}</span>
			</div>
		</div>
	</div>
);

TimelineDate.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineDate;
