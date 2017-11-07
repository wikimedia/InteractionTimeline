import React from 'react';
import PropTypes from 'prop-types';
import RevisionEntity from 'app/entities/revision';
import moment from 'moment';
import Wiki from 'app/entities/wiki';
import TimelineDate from './date';

const Revision = ( { side, revision, date, duration, wiki } ) => {
	let classes = [
		'revision',
		'row',
		'm-0'
	];

	const timestamp = moment( revision.timestamp, moment.ISO_8601 );

	const url = 'https://' + wiki.domain + '/w/index.php?diff=prev&oldid=' + revision.id;

	switch ( side ) {
		case 'right':
			classes = [
				...classes,
				'right',
				'justify-content-end'
			];
			break;
		case 'left':
			classes = [
				...classes,
				'left'
			];
			break;
	}

	let displayDate;

	if ( date ) {
		displayDate = (
			<TimelineDate icon="today" date={date.format( 'l' )} />
		);
	} else if ( duration ) {
		displayDate = (
			<TimelineDate icon="timelapse" date={duration.humanize()} />
		);
	}

	return (
		<div>
			{displayDate}
			<div className={classes.join( ' ' )}>
				<div className="col-md-6 col p-0">
					<div className="wrapper row">
						<div className="col mb-2 mt-2">
							<div className="record row justify-content-between">
								<div className="col-2 align-self-center">{timestamp.format( 'h:mma' )}</div>
								<a href={url} className="col-9 d-block content rounded pt-2 pb-2">
									<span className="d-block title">{revision.title}</span>
									<span className="d-block comment"><em>{revision.comment}</em></span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Revision.propTypes = {
	side: PropTypes.oneOf( [ 'left', 'right' ] ).isRequired,
	revision: PropTypes.instanceOf( RevisionEntity ).isRequired,
	wiki: PropTypes.instanceOf( Wiki ).isRequired,
	date: PropTypes.instanceOf( moment ),
	duration: PropTypes.shape( {
		humanize: PropTypes.func
	} )
};

Revision.defaultProps = {
	date: undefined,
	duration: undefined
};

export default Revision;
