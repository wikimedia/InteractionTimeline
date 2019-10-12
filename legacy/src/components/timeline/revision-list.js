import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { OrderedMap } from 'immutable';
import Revision from 'app/entities/revision';
import RevisionContainer from './revision/revision.container';

const RevisionList = ( { revisions, last } ) => {
	let prev = last;

	return revisions.map( ( revision ) => {
		let duration;
		let samePage = false;

		// If we are switching sides, show the duraction.
		if ( prev && prev.user !== revision.user ) {
			duration = moment.duration( prev.timestamp.diff( revision.timestamp ) );
			samePage = prev.pageId === revision.pageId;
		}

		// Set the previous state for
		prev = revision;

		return (
			<RevisionContainer key={revision.id} duration={duration} samePage={samePage} revision={revision} />
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
