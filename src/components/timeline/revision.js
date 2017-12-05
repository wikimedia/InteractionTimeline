import React from 'react';
import PropTypes from 'prop-types';
import RevisionEntity from 'app/entities/revision';
import moment from 'moment';
import Wiki from 'app/entities/wiki';
import Date from './date';
import Timelapse from './timelapse';

const Revision = ( { side, revision, date, duration, wiki } ) => {
	let classes = [
		'revision',
		'row',
		'm-0',
		'justify-content-end'
	];

	const timestamp = moment( revision.timestamp, moment.ISO_8601 );

	let url;
	if ( wiki ) {
		url = 'https://' + wiki.domain + '/w/index.php?diff=prev&oldid=' + revision.id;
	}

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
				'left',
				'flex-row-reverse'
			];
			break;
	}

	let displayDate;
	let displayTimelapse;

	if ( date ) {
		displayDate = (
			<Date icon="today" date={date.format( 'l' )} />
		);
	} else if ( duration ) {
		// Do not display if duration is greater than 24 hours.
		if ( duration.asSeconds() < 86400 /* Seconds in 24 hours */ ) {
			displayTimelapse = (
				<Timelapse icon="timelapse" date={duration.humanize()} />
			);
		}
	}

	return (
		<div className="row">
			<div className="col-xl-1 col-sm-2 col-12">
				{displayDate}
			</div>
			<div className="col-xl-10 col-sm-8 col-12">
				<div className={classes.join( ' ' )}>
					{displayTimelapse}
					<div className="col-md-6 col-12 p-0">
						<div className="wrapper row">
							<div className="col mb-1 mt-0">
								<div className="record row justify-content-between">
									<div className="col-xxl-1 col-xl-2 col-4 align-self-center timestamp">{timestamp.format( 'h:mma' )}</div>
									<a href={url} className="col-xxl-11 col-xl-10 col-8 d-block content rounded pt-1 pb-1">
										<span className="d-block title">{revision.title}</span>
										<span className="d-block comment"><em>{revision.comment}</em></span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Revision.propTypes = {
	side: PropTypes.oneOf( [ 'left', 'right' ] ),
	revision: PropTypes.instanceOf( RevisionEntity ).isRequired,
	wiki: PropTypes.instanceOf( Wiki ),
	date: PropTypes.instanceOf( moment ),
	duration: PropTypes.shape( {
		humanize: PropTypes.func
	} )
};

Revision.defaultProps = {
	side: undefined,
	date: undefined,
	duration: undefined,
	wiki: undefined
};

export default Revision;
