import { createSelector } from 'reselect';
import moment from 'moment';
import './editorinteract';

jest.mock( 'reselect' );
jest.mock( './users' );
jest.mock( './date' );

// The last argument of the last call is the function to test.
const call = createSelector.mock.calls[ createSelector.mock.calls.length - 1 ];
const getEditorInteractUrl = call[ call.length - 1 ];

test( 'returns an editorinteract url', () => {
	const url = getEditorInteractUrl( 'testwiki', [ 'Derby pie', 'Sweets lover' ], moment.utc( '1970-01-01T00:00' ), moment.utc( '1999-12-31T23:59' ) );
	expect( url ).toEqual( 'https://tools.wmflabs.org/sigma/editorinteract.py?server=testwiki&users=Derby%20pie&users=Sweets%20lover&startDate=19700101&endDate=19991231' );
} );
