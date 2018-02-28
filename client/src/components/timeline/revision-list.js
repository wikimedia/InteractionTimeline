import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { OrderedMap } from 'immutable';
import RevisionContainer from './revision/revision.container';

const RevisionList = ( { revisions } ) => {
	const first = revisions.first();
	let prev;

	return revisions.map( ( revision ) => {
		let duration;

		// If we are switching sides, but not the date, show the duraction.
		if ( revision !== first && prev && prev.user !== revision.user ) {
			duration = moment.duration( prev.timestamp.diff( revision.timestamp ) );
		}

		// Set the previous state for
		prev = revision;

		return (
			<RevisionContainer key={revision.id} duration={duration} revision={revision} />
		);
	} ).toArray();
};

RevisionList.propTypes = {
	revisions: PropTypes.instanceOf( OrderedMap ).isRequired
};

export default RevisionList;
