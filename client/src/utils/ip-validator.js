/**
 * NOTE: Borrows from https://github.com/wikimedia/mediawiki/blob/master/includes/libs/IP.php
 */

export const isIPv4Address = ( address ) => {

	if ( typeof address !== 'string' ) {
		return false;
	}

	let RE_IP_BYTE = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|0?[0-9]?[0-9])';
	let RE_IP_ADD = '(?:' + RE_IP_BYTE + '\\.){3}' + RE_IP_BYTE;

	return ( new RegExp( '^' + RE_IP_ADD + '$' ).test( address ) );
};

export const isIPv6Address = ( address ) => {
	let RE_IPV6_ADD;

	if ( typeof address !== 'string' ) {
		return false;
	}

	RE_IPV6_ADD =
		'(?:' + // starts with "::" (including "::")
			':(?::|(?::' +
				'[0-9A-Fa-f]{1,4}' +
			'){1,7})' +
			'|' + // ends with "::" (except "::")
			'[0-9A-Fa-f]{1,4}' +
			'(?::' +
				'[0-9A-Fa-f]{1,4}' +
			'){0,6}::' +
			'|' + // contains no "::"
			'[0-9A-Fa-f]{1,4}' +
			'(?::' +
				'[0-9A-Fa-f]{1,4}' +
			'){7}' +
		')';

	if ( new RegExp( '^' + RE_IPV6_ADD + '$' ).test( address ) ) {
		return true;
	}

	// contains one "::" in the middle (single '::' check below)
	RE_IPV6_ADD =
		'[0-9A-Fa-f]{1,4}' +
		'(?:::?' +
			'[0-9A-Fa-f]{1,4}' +
		'){1,6}';

	return (
		new RegExp( '^' + RE_IPV6_ADD + '$' ).test( address ) &&
		/::/.test( address ) &&
		!/::.*::/.test( address )
	);
};

export const isIPAddress = ( address ) => {
	return isIPv4Address( address ) ||
		isIPv6Address( address );
};
