import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const TimelineDate = ( { icon, date } ) => (
	<div className="row justify-content-center">
		<div className="col-2 pb-2 pt-2 border text-center align-text-middle">
			<div className="d-flex justify-content-center align-items-center">
				<i className="mr-2 material-icons md-48">{icon}</i>
				<span>{date}</span>
			</div>
		</div>
	</div>
);

TimelineDate.propTypes = {
	icon: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired
};

export default TimelineDate;
