import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Set, Map } from 'immutable';
import Wiki from 'app/entities/wiki';
import RevisionContainer from './revision.container';

const getSide = ( user, users ) => {
	let side;

	if ( user === users.first() ) {
		side = 'left';
	} else if ( user === users.last() ) {
		side = 'right';
	}

	return side;
};

const Timeline = ( { revisions, users } ) => {
	let prev;

	const edits = revisions.map( ( revision ) => {
		const timestamp = moment( revision.timestamp );
		let date;
		let duration;

		if ( !prev || !timestamp.isSame( prev.timestamp, 'day' ) ) {
			date = timestamp;
		}

		const side = getSide( revision.user, users );

		// If we are switching sides, but not the date, show the duraction.
		if ( !date && getSide( prev.user, users ) !== side ) {
			duration = moment.duration( moment( prev.timestamp ).diff( timestamp ) );
		}

		// Set the previous state for
		prev = revision;

		return (
			<RevisionContainer key={revision.id} side={side} date={date} duration={duration} revision={revision} />
		);
	} ).toArray();

	return (
		<div className="timeline container">
			{edits}
		</div>
	);
};

Timeline.propTypes = {
	users: PropTypes.instanceOf( Set ).isRequired,
	revisions: PropTypes.instanceOf( Map ).isRequired
};

export default Timeline;
