import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RevisionEntity from 'app/entities/revision';
import Header from 'app/components/timeline/header';
import Spinner from 'app/components/timeline/spinner';

const HeaderRevision = ( { revision, url, side, timestamp } ) => {
	if ( !revision ) {
		return (
			<Header />
		);
	}

	if ( revision.meta.status === 'ready' ) {
		return (
			<Header href={url} />
		);
	}

	if ( revision.meta.status === 'fetching' ) {
		return (
			<Header href={url}>
				<Spinner />
			</Header>
		);
	}

	return (
		<Header href={url} side={side} className="text-center">
			{revision.user}<br />
			{timestamp.format( 'YYYY-MM-DD' )} &mdash; {timestamp.format( 'h:mma' )}
		</Header>
	);
};

HeaderRevision.propTypes = {
	revision: PropTypes.instanceOf( RevisionEntity ),
	url: PropTypes.string,
	timestamp: PropTypes.instanceOf( moment ),
	side: PropTypes.string
};

HeaderRevision.defaultProps = {
	revision: undefined,
	url: undefined,
	timestamp: undefined,
	side: undefined
};

export default HeaderRevision;
