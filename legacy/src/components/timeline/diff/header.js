import React from 'react';
import PropTypes from 'prop-types';
import RevisionEntity from 'app/entities/revision';
import RevisionHeaderContainer from './header-revision.container';

const Header = ( { from, to } ) => {
	return (
		<React.Fragment>
			<RevisionHeaderContainer revision={from} />
			<RevisionHeaderContainer revision={to} />
		</React.Fragment>
	);
};

Header.propTypes = {
	from: PropTypes.instanceOf( RevisionEntity ),
	to: PropTypes.instanceOf( RevisionEntity )
};

Header.defaultProps = {
	from: undefined,
	to: undefined
};

export default Header;
