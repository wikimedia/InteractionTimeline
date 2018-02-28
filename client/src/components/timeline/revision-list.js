import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { OrderedMap } from 'immutable';
import Revision from 'app/entities/revision';
import RevisionContainer from './revision/revision.container';

const RevisionList = ( { revisions, last } ) => {
	let prev = last;

	return revisions.map( ( revision ) => {
		const timestamp = moment( revision.timestamp, moment.ISO_8601 ).utc();
		let duration;

		// If we are switching sides, show the duraction.
		if ( prev && prev.user !== revision.user ) {
			duration = moment.duration( moment( prev.timestamp, moment.ISO_8601 ).utc().diff( timestamp ) );
		}

		// Set the previous state for
		prev = revision;

		return (
			<RevisionContainer key={revision.id} duration={duration} revision={revision} />
		);
	} ).toArray();
};

RevisionList.propTypes = {
	revisions: PropTypes.instanceOf( OrderedMap ).isRequired,
	last: PropTypes.instanceOf( Revision )
};

RevisionList.defaultProps = {
	last: undefined
};

export default RevisionList;
