import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import RevisionEntity from 'app/entities/revision';
import DiffEntity from 'app/entities/diff';
import moment from 'moment';
import Date from './date';
import DiffContainer from './diff/diff.container';
import Timelapse from './timelapse';

const REGEX_EDIT_SUMMARY_PARTS = /(?:\/\*([^*]+)\*\/)?(.+)?/;

class Revision extends React.Component {

	constructor() {
		super();

		this.handleClick = this.handleClick.bind( this );
	}

	// Append section name to the page title if it is included in the edit summary
	getDisplayTitle( title, comment ) {
		const matches = comment.match( REGEX_EDIT_SUMMARY_PARTS );

		if ( matches[ 1 ] ) {
			return title + ' § ' + matches[ 1 ].trim();
		}

		return title;
	}

	// Return edit summary without the section name if present
	getDisplayComment( comment ) {
		const matches = comment.match( REGEX_EDIT_SUMMARY_PARTS );

		// return edit summary without section name or empty
		if ( matches[ 2 ] ) {
			return matches[ 2 ].trim();
		} else {
			return '';
		}
	}

	handleClick( e ) {
		// Detect if user is attempting to open in a new window.
		if ( e.shiftKey || e.ctrlKey || e.metaKey ) {
			return;
		}

		e.preventDefault();

		this.props.toggleDiff( this.props.diff, this.props.revision.suppressed );
	}

	render() {
		let classes = [
			'revision',
			'row',
			'm-0',
			'justify-content-end'
		];

		switch ( this.props.side ) {
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

		if ( this.props.date ) {
			displayDate = (
				<Date icon="today" date={this.props.date.format( 'YYYY-MM-DD' )} />
			);
		} else if ( this.props.duration ) {
			// Do not display if duration is greater than 24 hours.
			if ( this.props.duration.asSeconds() < 86400 /* Seconds in 24 hours */ ) {
				displayTimelapse = (
					<Timelapse icon="timelapse" date={this.props.duration.humanize()} />
				);
			}
		}

		const revisionComment = this.props.revision.commenthidden ? <del><FormattedMessage id="revision-edit-summary-removed" /></del> : this.getDisplayComment( this.props.revision.comment );

		let linkClassName = [
			'col-xxl-11',
			'col-xl-10',
			'col-8',
			'd-block',
			'content',
			'pt-1'
		];

		if ( this.props.diff.meta.show ) {
			linkClassName = [
				...linkClassName,
				'rounded-top',
				'pb-2'
			];
		} else {
			linkClassName = [
				...linkClassName,
				'rounded',
				'mb-1',
				'pb-1'
			];

			classes = [
				...classes,
				'h-100'
			];
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
							<div className="wrapper h-100 row">
								<div className="col mt-0">
									<div className="record row h-100 align-items-center justify-content-between">
										<div className="col-xxl-1 col-xl-2 col-4 align-self-center timestamp">{this.props.timestamp.format( 'HH:mm' )}</div>
										{/* @TODO Change this to an anchored link on the timeline (with the diff opened). */}
										<a href={this.props.url} className={linkClassName.join( ' ' )} onClick={this.handleClick}>
											<div className="row align-items-end">
												<div className="col">
													<span className="d-block title">{this.getDisplayTitle( this.props.revision.title, this.props.revision.comment )}</span>
													<span className="d-block comment"><em>{ revisionComment }</em></span>
												</div>
												<div className="col-auto">
													<small><strong>{this.props.revision.minor ? 'm' : ''}</strong> ({this.props.revision.sizediff > 0 ? '+' : ''}{this.props.revision.sizediff})</small>
												</div>
											</div>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<DiffContainer diff={this.props.diff} revision={this.props.revision} side={this.props.side} />
				</div>
			</div>
		);
	}
}

Revision.propTypes = {
	side: PropTypes.oneOf( [ 'left', 'right' ] ),
	revision: PropTypes.instanceOf( RevisionEntity ).isRequired,
	date: PropTypes.instanceOf( moment ),
	timestamp: PropTypes.instanceOf( moment ).isRequired,
	duration: PropTypes.shape( {
		humanize: PropTypes.func,
		asSeconds: PropTypes.func
	} ),
	url: PropTypes.string,
	diff: PropTypes.instanceOf( DiffEntity ).isRequired,
	toggleDiff: PropTypes.func.isRequired
};

Revision.defaultProps = {
	side: undefined,
	date: undefined,
	duration: undefined,
	url: undefined
};

export default Revision;
