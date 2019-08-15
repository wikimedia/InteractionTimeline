import React from 'react';
import PropTypes from 'prop-types';
import Link from 'app/components/link';

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
		'd-flex',
		'justify-content-center',
		'align-items-center'
	];

	if ( side ) {
		className = [
			...className,
			side
		];
	}

	return (
		<div className={className.join( ' ' )}>
			{children}
		</div>
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
