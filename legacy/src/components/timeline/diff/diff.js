import React from 'react';
import PropTypes from 'prop-types';
import Revision from 'app/entities/revision';
import DiffEntity from 'app/entities/diff';
import { Message } from '@wikimedia/react.i18n';
import Spinner from 'app/components/timeline/spinner';
import ErrorMessage from 'app/components/timeline/error-message';
import HeaderContainer from './header.container';

const StatusWrapper = ( { children, className, closeDiff } ) => (
	<div className={className}>
		<div className="col-12 pt-3">
			<div className="row align-items-center justify-content-center">
				{children}
			</div>
		</div>
		<CloseButton closeDiff={closeDiff} />
	</div>
);

StatusWrapper.propTypes = {
	className: PropTypes.string,
	children: PropTypes.element,
	closeDiff: PropTypes.func
};

StatusWrapper.defaultProps = {
	className: '',
	children: undefined,
	closeDiff: undefined
};

const CloseButton = ( { closeDiff } ) => (
	<div className="col-1 close-container">
		<div className="row">
			<div className="col-3 p-0 text-center border-top border-right border-bottom rounded-right">
				<button type="button" className="close float-none" aria-label="Close" onClick={closeDiff}>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
		</div>
	</div>
);

CloseButton.propTypes = {
	closeDiff: PropTypes.func
};

CloseButton.defaultProps = {
	closeDiff: undefined
};

const Diff = ( { revision, diff, side, closeDiff } ) => {
	if ( !diff.meta.show ) {
		return null;
	}

	let className = [
		'diff',
		'row',
		'wrapper',
		'border',
		'rounded-bottom',
		'mb-2',
		'pb-2',
		'flex-nowrap',
		side
	];

	if ( side === 'right' ) {
		className = [
			...className,
			'rounded-left'
		];
	}

	if ( revision.suppressed ) {
		return (
			<div className={className.join( ' ' )}>
				<div className="col-12 pt-2">
					<div className="row align-items-center justify-content-center">
						<div className="col text-center">
							<Message id="error-suppressed-diff" />
						</div>
					</div>
				</div>
				<CloseButton closeDiff={closeDiff} />
			</div>
		);
	}

	if ( diff.meta.status === 'fetching' ) {
		return (
			<StatusWrapper className={className.join( ' ' )} closeDiff={closeDiff}>
				<Spinner />
			</StatusWrapper>
		);
	}

	if ( diff.meta.status === 'error' ) {
		return (
			<StatusWrapper className={className.join( ' ' )} closeDiff={closeDiff}>
				<ErrorMessage error={diff.meta.error} />
			</StatusWrapper>
		);
	}

	return (
		<div className={className.join( ' ' )}>
			<div className="col-12">
				<div className="row">
					<HeaderContainer diff={diff} />
				</div>
				<div className="row content">
					<div className="col-12">
						<table className="table">
							<colgroup>
								<col className="diff-marker" />
								<col className="diff-content" />
								<col className="diff-marker" />
								<col className="diff-content" />
							</colgroup>
							<tbody
								dangerouslySetInnerHTML={{ __html: diff.body }} // eslint-disable-line react/no-danger
							/>
						</table>
					</div>
				</div>
			</div>
			<CloseButton closeDiff={closeDiff} />
		</div>
	);
};

Diff.propTypes = {
	revision: PropTypes.instanceOf( Revision ).isRequired,
	diff: PropTypes.instanceOf( DiffEntity ).isRequired,
	side: PropTypes.string.isRequired,
	closeDiff: PropTypes.func
};

Diff.defaultProps = {
	closeDiff: undefined
};

export default Diff;
