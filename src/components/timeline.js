import React from 'react';
import { Set } from 'immutable';
import moment from 'moment';

const revisions = [
	{
		id: 777,
		title: 'User talk:DBarratt (WMF)',
		user: 'Davidwbarratt',
		timestamp: moment( '2017-10-16T18:32:18Z' ),
		comment: '/* Test 4 */ new section'
	},
	{
		id: 123,
		title: 'User talk:DBarratt (WMF)',
		user: 'Davidwbarratt',
		timestamp: moment( '2017-10-16T18:32:18Z' ),
		comment: '/* Test 4 */ new section'
	},
	{
		id: 5456,
		title: 'User talk:DBarratt (WMF)',
		user: 'DBarratt (WMF)',
		timestamp: moment( '2017-10-16T18:32:18Z' ),
		comment: '/* Test 4 */ new section'
	},
	{
		id: 345,
		title: 'User talk:DBarratt (WMF)',
		user: 'Davidwbarratt',
		timestamp: moment( '2017-10-16T18:32:18Z' ),
		comment: '/* Test 4 */ new section'
	}
];

export default () => {
	const edits = revisions.map( ( revision ) => {
		let classes = new Set( [
			'revision',
			'row',
			'm-0'
		] );

		// Determine left or right side.
		if ( revision.user === 'DBarratt (WMF)' ) {
			classes = classes.add( 'right' ).add( 'justify-content-end' );
		} else {
			classes = classes.add( 'left' );
		}

		return (
			<div className={classes.join( ' ' )} key={revision.id}>
				<div className="col-6 p-0">
					<div className="wrapper row pb-2">
						<div className="col">
							<div className="record row justify-content-end">
								<div className="col-2 align-self-center mr-3">{revision.timestamp.format( 'h:mma' )}</div>
								<a href="#" className="col-8 d-block content pt-2 pb-2">
									<span className="d-block title">{revision.title}</span>
									<span className="d-block text-muted comment"><em>{revision.comment}</em></span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	} );

	return (
		<div className="timeline container">
			{edits}
		</div>
	);
};
