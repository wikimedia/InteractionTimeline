import React from 'react';
import PropTypes from 'prop-types';
import UserListContainer from './user-list.container';
import DateRevisionsContainer from './date-revisions.container';
import StatusContainer from './status.container';

const Users = () => (
	<div className="row sticky-top">
		<div className="col ml-3 mr-3">
			<div className="row users pr-1 pl-1 justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row  align-items-center justify-content-around text-center">
						<UserListContainer />
					</div>
				</div>
			</div>
		</div>
	</div>
);

const Status = ( { empty } ) => {
	let className = [
		'status',
		'row'
	];

	if ( !empty ) {
		className = [
			...className,
			'has-content'
		];
	}

	return (
		<div className={className.join( ' ' )}>
			<div className="col">
				<div className="row mt-3 mb-3">
					<div className="col ml-3 mr-3">
						<StatusContainer />
					</div>
				</div>
			</div>
		</div>
	);
};

Status.propTypes = {
	empty: PropTypes.bool.isRequired
};

const Timeline = ( { status, empty } ) => {
	if ( status === 'notready' ) {
		return (
			<div className="timeline">
				<Status empty={empty} />
			</div>
		);
	}

	if ( empty ) {
		return (
			<div className="timeline">
				<Users />
				<Status empty={empty} />
			</div>
		);
	}

	return (
		<div className="timeline">
			<Users />
			<DateRevisionsContainer />
			<Status empty={empty} />
		</div>
	);
};

Timeline.propTypes = {
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	empty: PropTypes.bool.isRequired
};

export default Timeline;
