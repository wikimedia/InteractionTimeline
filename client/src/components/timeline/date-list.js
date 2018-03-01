import React from 'react';
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import Date from './date';
import RevisionList from './revision-list';

const DateList = ( { revisions } ) => {
	let prev;

	return revisions
		.filter( revision => revision.meta.interaction )
		.groupBy( revision => revision.timestamp.clone().startOf( 'day' ) )
		.map( ( list, date ) => {
			let last = prev ? prev.last() : undefined;

			prev = list;
			return (
				<div className="row day border pl-2 pr-2 pt-2 pb-2 mb-3" key={date.format( 'YYYY-MM-DD' )}>
					<div className="col-xl-1 col-sm-2 col-12">
						<Date icon="today" date={date.format( 'YYYY-MM-DD' )} />
					</div>
					<div className="col-xl-10 col-sm-8 col-12">
						<RevisionList revisions={list} last={last} />
					</div>
				</div>
			);
	} ).toArray();
};

DateList.propTypes = {
	revisions: PropTypes.instanceOf( OrderedMap ).isRequired
};

export default DateList;
