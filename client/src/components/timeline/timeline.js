import React from 'react';
import PropTypes from 'prop-types';
import UserListContainer from './user-list.container';
import DateRevisionsContainer from './date-revisions.container';
import StatusContainer from './status.container';

const Timeline = ( { status } ) => {
	if ( status === 'notready' ) {
		return (
			<div className="timeline">
				<StatusContainer />
			</div>
		);
	}

	return (
		<div className="timeline">
			<div className="row">
				<div className="col ml-3 mr-3">
					<div className="row users pr-1 pl-1 justify-content-center">
						<div className="col-xl-10 col-sm-8">
							<div className="row align-items-center justify-content-around text-center">
								<UserListContainer />
							</div>
						</div>
					</div>
				</div>
			</div>
			<DateRevisionsContainer />
			<StatusContainer />
		</div>
	);
};

Timeline.propTypes = {
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired
};

export default Timeline;
