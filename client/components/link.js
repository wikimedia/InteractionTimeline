import React from 'react';
import PropTypes from 'prop-types';

function Link( props ) {
	const { href } = props;
	const Tag = href ? 'a' : 'span';

	return (
		<Tag
			{...props} // eslint-disable-line react/jsx-props-no-spreading
		/>
	);
}

Link.propTypes = {
	href: PropTypes.string,
};

Link.defaultProps = {
	href: undefined,
};

export default Link;
