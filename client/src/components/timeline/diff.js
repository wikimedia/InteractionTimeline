import React from 'react';
import PropTypes from 'prop-types';
import RevisionDiff from 'app/entities/diff';
import Spinner from './spinner';
import UserContainer from './user.container';

const Diff = ( { diff, side } ) => {
	if ( !diff.meta.show ) {
		return null;
	}

	if ( diff.meta.status === 'fetching' ) {
		return <Spinner />;
	}

	let classNames = [
		'diff',
		'row',
		'border',
		'rounded',
		'justify-content-center',
		'mb-1',
		'pt-2',
		'pb-2',
		side
	];

	return (
		<div className={classNames.join( ' ' )}>
			<div className="col-11">
				<div className="row">
					<UserContainer user={diff.fromuser} />
					<UserContainer user={diff.touser} />
				</div>
				<div className="row content">
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
	);
};

Diff.propTypes = {
	diff: PropTypes.instanceOf( RevisionDiff ).isRequired,
	side: PropTypes.string.isRequired
};

export default Diff;
