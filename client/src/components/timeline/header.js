import React from 'react';
import PropTypes from 'prop-types';

const Header = ( { children, href, className, side } ) => {
	if ( !children ) {
		return (
			<div className="col-6" />
		);
	}

	className = [
		...className.split( ' ' ),
		'user',
		'col-6',
		'pt-2',
		'pb-2',
		'd-block'
	];

	if ( side ) {
		className = [
			...className,
			side
		];
	}

	const Tag = href ? 'a' : 'div';

	return (
		<Tag href={href} className={className.join( ' ' )}>
			<div className="d-flex justify-content-center align-items-center">
				{children}
			</div>
		</Tag>
	);
};

Header.propTypes = {
	children: PropTypes.node,
	side: PropTypes.string,
	className: PropTypes.string,
	href: PropTypes.string
};

Header.defaultProps = {
	children: undefined,
	side: undefined,
	className: '',
	href: undefined
};

export default Header;
