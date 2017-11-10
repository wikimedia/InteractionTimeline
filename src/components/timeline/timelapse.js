import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineTimelapse = ( { date } ) => (
	<div className="row justify-content-center">
		<div className="col-md-3 col-sm-6 col-10 pb-2 pt-2 border rounded text-center align-text-middle">
			<div className="d-flex justify-content-center align-items-center">
				<i className="mr-2 material-icons md-48">timelapse</i>
				<span>{date}</span>
			</div>
		</div>
	</div>
);

TimelineTimelapse.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineTimelapse;
