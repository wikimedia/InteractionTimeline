import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { OrderedMap } from 'immutable';
import Date from './date';
import RevisionList from './revision-list';

const DateRevisions = ( { revisions } ) => (
	revisions.groupBy( revision => moment( revision.timestamp, moment.ISO_8601 ).utc().startOf( 'day' ) ).map( ( list, date ) => (
		<div className="row" key={date.format( 'YYYY-MM-DD' )}>
			<div className="col-xl-1 col-sm-2 col-12">
				<Date icon="today" date={date.format( 'YYYY-MM-DD' )} />
			</div>
			<div className="col-xl-10 col-sm-8 col-12">
				<RevisionList revisions={list} />
			</div>
		</div>
	) ).toArray()
);

DateRevisions.propTypes = {
	revisions: PropTypes.instanceOf( OrderedMap ).isRequired
};

export default DateRevisions;
