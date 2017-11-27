import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineTimelapse = ( { date } ) => (
	<div className="row justify-content-center timelapse">
		<div className="col-xl-1 col-md-3 col-sm-6 col-10 pb-1 pt-1 box border rounded text-center align-text-middle">
			<div className="d-flex small justify-content-center align-items-center">
				<i className="mr-2 material-icons">timelapse</i>
				<span>{date}</span>
			</div>
		</div>
	</div>
);

TimelineTimelapse.propTypes = {
	date: PropTypes.string.isRequired
};

export default TimelineTimelapse;
