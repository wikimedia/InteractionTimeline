import React from 'react';
import PropTypes from 'prop-types';
import RevisionDiff from 'app/entities/diff';
import Spinner from 'app/components/timeline/spinner';
import ErrorMessageContainer from './error-message.container';
import HeaderContainer from './header.container';

const StatusWrapper = ( { children, className } ) => (
	<div className={className}>
		<div className="col-12">
			<div className="row align-items-center justify-content-center">
				{children}
			</div>
		</div>
	</div>
);

StatusWrapper.propTypes = {
	className: PropTypes.string,
	children: PropTypes.element
};

StatusWrapper.defaultProps = {
	className: '',
	children: undefined
};

const Diff = ( { id, diff, side } ) => {
	if ( !diff.meta.show ) {
		return null;
	}

	let className = [
		'diff',
		'row',
		'wrapper',
		'border',
		'rounded-bottom',
		side === 'left' ? 'rounded-right' : 'rounded-left',
		'mb-2',
		'pb-2',
		side
	];

	if ( diff.meta.status === 'fetching' ) {
		className = [
			...className,
			'pt-3'
		];
		return (
			<StatusWrapper className={className.join( ' ' )}>
				<Spinner />
			</StatusWrapper>
		);
	}

	if ( diff.meta.status === 'error' ) {
		className = [
			...className,
			'pt-3'
		];
		return (
			<StatusWrapper className={className.join( ' ' )}>
				<ErrorMessageContainer id={id} diff={diff} error={diff.meta.error} />
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
							<tbody dangerouslySetInnerHTML={{ __html: diff.body }} />
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

Diff.propTypes = {
	id: PropTypes.number.isRequired,
	diff: PropTypes.instanceOf( RevisionDiff ).isRequired,
	side: PropTypes.string.isRequired
};

export default Diff;
