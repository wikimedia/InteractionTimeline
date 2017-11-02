import React from 'react';
import moment from 'moment';
import { OrderedMap } from 'immutable';
import RevisionEntity from 'app/entities/revision';
import Revision from './revision';

// @TODO Get from store.
const users = [
	'Davidwbarratt',
	'DBarratt (WMF)'
];

// @TODO Get from store.
const revisions = new OrderedMap( [
	[
		777,
		new RevisionEntity( {
			id: 777,
			title: 'User talk:DBarratt (WMF)',
			user: 'Davidwbarratt',
			timestamp: '2017-10-01T18:32:18Z',
			comment: '/* Test 4 */ new section'
		} )
	],
	[
		123,
		new RevisionEntity( {
			id: 123,
			title: 'User talk:DBarratt (WMF)',
			user: 'Davidwbarratt',
			timestamp: '2017-10-13T18:32:18Z',
			comment: '/* Test 4 */ new section'
		} )
	],
	[
		345,
		new RevisionEntity( {
			id: 345,
			title: 'User talk:DBarratt (WMF)',
			user: 'DBarratt (WMF)',
			timestamp: '2017-10-16T18:32:18Z',
			comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dignissim ligula eu eros suscipit, eu euismod elit aliquet. Nam hendrerit metus eget auctor vehicula. Mauris eget leo in mauris suscipit ornare et id sapien.'
		} )
	],
	[
		5456,
		new RevisionEntity( {
			id: 5456,
			title: 'User talk:DBarratt (WMF)',
			user: 'Davidwbarratt',
			timestamp: '2017-10-16T18:32:18Z',
			comment: '/* Test 4 */ new section'
		} )
	],
	[
		999,
		new RevisionEntity( {
			id: 999,
			title: 'User talk:DBarratt (WMF)',
			user: 'Davidwbarratt',
			timestamp: '2017-10-16T18:32:18Z',
			comment: ''
		} )
	]
] );

const getSide = ( user, users ) => {
	let side;
	if ( user === users[ 0 ] ) {
		side = 'left';
	} else if ( user === users[ 1 ] ) {
		side = 'right';
	}

	return side;
};

export default () => {
	let prev;

	const edits = revisions.map( ( revision ) => {
		const timestamp = moment( revision.timestamp );
		let date;
		let duration;

		if ( !prev || !timestamp.isSame( prev.timestamp, 'day' ) ) {
			date = timestamp;
		}

		const side = getSide( revision.user, users );

		// If we are switching sides, but not the date, show the duraction.
		if ( !date && getSide( prev.user, users ) !== side ) {
			duration = moment.duration( moment( prev.timestamp ).diff( timestamp ) );
		}

		// Set the previous state for
		prev = revision;

		return (
			<Revision key={revision.id} side={side} date={date} duration={duration} revision={revision} />
		);
	} ).toArray();

	return (
		<div className="timeline container">
			{edits}
		</div>
	);
};
