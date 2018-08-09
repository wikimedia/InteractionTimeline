import React from 'react';
import { shallow } from 'enzyme';
import { Button, Modal } from 'reactstrap';
import Share from './share';

test( 'hide button when no results are present', () => {
	const share = shallow( <Share empty users={[ 'Derby pie', 'Sweets lover' ]} queryString="?user=Derby%20pie&user=Sweets%20lover" /> );
	expect( share.find( Button ).first().hasClass( 'invisible' ) ).toBeTruthy();
} );

test( 'show button when results are present', () => {
	const share = shallow( <Share empty={false} users={[ 'Derby pie', 'Sweets lover' ]} queryString="?user=Derby%20pie&user=Sweets%20lover" /> );
	expect( share.find( Button ).first().hasClass( 'visible' ) ).toBeTruthy();
} );

test( 'clicking on the button opens the modal with selected text', () => {
	const share = shallow( <Share empty={false} users={[ 'Derby pie', 'Sweets lover' ]} queryString="?user=Derby%20pie&user=Sweets%20lover" /> );

	expect( share.find( Modal ).prop( 'isOpen' ) ).toBeFalsy();

	share.find( Button ).first().simulate( 'click' );
	expect( share.find( Modal ).prop( 'isOpen' ) ).toBeTruthy();
} );
