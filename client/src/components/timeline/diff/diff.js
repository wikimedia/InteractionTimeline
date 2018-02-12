import React from 'react';
import PropTypes from 'prop-types';
import RevisionDiff from 'app/entities/diff';
import Spinner from 'app/components/timeline/spinner';
import HeaderContainer from './header.container';

const Diff = ( { diff, side } ) => {
	if ( !diff.meta.show ) {
		return null;
	}

	let classNames = [
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
		classNames = [
			...classNames,
			'pt-3'
		];
		return (
			<div className={classNames.join( ' ' )}>
				<div className="col-12">
					<div className="row align-items-center justify-content-center">
						<Spinner />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames.join( ' ' )}>
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
	diff: PropTypes.instanceOf( RevisionDiff ).isRequired,
	side: PropTypes.string.isRequired
};

export default Diff;
