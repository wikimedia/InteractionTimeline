import React from 'react';
import PropTypes from 'prop-types';
import RevisionDiff from 'app/entities/diff';
import Spinner from './spinner';

const Diff = ( { diff } ) => {
	if ( !diff.meta.show ) {
		return null;
	}

	if ( diff.meta.status === 'fetching' ) {
		return <Spinner />;
	}

	return (
		<div className="row">
			<div className="col-12">
				<table dangerouslySetInnerHTML={{ __html: diff.body }} />
			</div>
		</div>
	);
};

Diff.propTypes = {
	diff: PropTypes.instanceOf( RevisionDiff ).isRequired
};

export default Diff;
