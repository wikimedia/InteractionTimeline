import React from 'react';
import PropTypes from 'prop-types';
import RevisionEntity from 'app/entities/revision';
import DiffEntity from 'app/entities/diff';
import DiffContainer from 'app/components/timeline/diff/diff.container';
import moment from 'moment';
import Timelapse from './timelapse';
import ByteChange from './byte-change';
import Title from './title';
import Comment from './comment';

class Revision extends React.Component {

	constructor() {
		super();

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( e ) {
		// Detect if user is attempting to open in a new window.
		if ( e.shiftKey || e.ctrlKey || e.metaKey || e.button === 1 ) {
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

		let displayTimelapse;

		if ( this.props.duration ) {
			displayTimelapse = (
				<Timelapse icon="timelapse" date={this.props.duration.humanize()} />
			);
		}

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
		}

		return (
			<React.Fragment>
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
												<span className="d-block title">
													<Title title={this.props.revision.title} comment={this.props.revision.comment} />
												</span>
												<span className="d-block comment">
													<Comment comment={this.props.revision.comment} commenthidden={this.props.revision.commenthidden} />
												</span>
											</div>
											<div className="col-auto">
												<ByteChange sizediff={this.props.revision.sizediff} minor={this.props.revision.minor} />
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<DiffContainer diff={this.props.diff} revision={this.props.revision} side={this.props.side} />
			</React.Fragment>
		);
	}
}

Revision.propTypes = {
	side: PropTypes.oneOf( [ 'left', 'right' ] ),
	revision: PropTypes.instanceOf( RevisionEntity ).isRequired,
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
	duration: undefined,
	url: undefined
};

export default Revision;
