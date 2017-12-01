import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Set, Map } from 'immutable';
import RevisionContainer from './revision.container';
import User from './user';
import Spinner from './spinner';

const getSide = ( user, users ) => {
	let side;

	if ( user === users.first() ) {
		side = 'left';
	} else if ( user === users.last() ) {
		side = 'right';
	}

	return side;
};

const Timeline = ( { revisions, users, status } ) => {
	let prev;

	const edits = revisions.map( ( revision ) => {
		const timestamp = moment( revision.timestamp, moment.ISO_8601 );
		let date;
		let duration;

		if ( !prev || !timestamp.isSame( prev.timestamp, 'day' ) ) {
			date = timestamp;
		}

		const side = getSide( revision.user, users );

		// If we are switching sides, but not the date, show the duraction.
		if ( !date && getSide( prev.user, users ) !== side ) {
			duration = moment.duration( moment( prev.timestamp, moment.ISO_8601 ).diff( timestamp ) );
		}

		// Set the previous state for
		prev = revision;

		return (
			<RevisionContainer key={revision.id} side={side} date={date} duration={duration} revision={revision} />
		);
	} ).toArray();

	const userDisplay = users.map( ( user ) => {
		return (
			<User key={user} user={user} side={getSide( user, users )} />
		);
	} ).toArray();

	const spinner = ( status === 'fetching' ) ? ( <Spinner /> ) : undefined;

	return (
		<div className="timeline container-fluid">
			<div className="row justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row align-items-center justify-content-around mb-3 text-center">
						{userDisplay}
					</div>
				</div>
			</div>
			{edits}
			{spinner}
		</div>
	);
};

Timeline.propTypes = {
	users: PropTypes.instanceOf( Set ).isRequired,
	revisions: PropTypes.instanceOf( Map ).isRequired,
	status: PropTypes.oneOf( [ 'ready', 'fetching' ] ).isRequired
};

export default Timeline;
