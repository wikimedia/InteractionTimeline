import React from 'react';
import PropTypes from 'prop-types';
import Link from '../link';

function Header( {
	children,
	href,
	className,
	side,
} ) {
	if ( !children ) {
		return (
			<div className="col-6" />
		);
	}

	let classNameList = [
		...className.split( ' ' ),
		'user',
		'col-6',
		'pt-2',
		'pb-2',
		'd-flex',
		'justify-content-center',
		'align-items-center',
	];

	if ( side ) {
		classNameList = [
			...classNameList,
			side,
		];
	}

	return (
		<Link href={href} className={classNameList.join( ' ' )}>
			{children}
		</Link>
	);
}

Header.propTypes = {
	children: PropTypes.node,
	side: PropTypes.string,
	className: PropTypes.string,
	href: PropTypes.string,
};

Header.defaultProps = {
	children: undefined,
	side: undefined,
	className: '',
	href: undefined,
};

export default Header;
