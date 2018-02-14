import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Set, Map } from 'immutable';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import RevisionContainer from './revision.container';
import UserContainer from './user.container';
import StatusContainer from './status.container';

class Timeline extends React.PureComponent {

	componentDidMount() {
		const doc = this.container.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;

		this.invokeFetch = new Subject();

		const badStatus = [
			'done',
			'notready'
		];

		// Create the infinite scroll.
		this.infinite = Observable.merge(
			Observable.fromEvent( win, 'scroll' ),
			Observable.fromEvent( win, 'resize' ),
			this.invokeFetch
		)
			.filter( () => !badStatus.includes( this.props.status ) )
			.filter( () => !this.props.revisions.isEmpty() )
			.filter( () => this.isBottomVisable( this.container ) )
			.debounceTime( 250 )
			.subscribe( () => {
				// The debounce delays the immisions so the props may not be the same.
				if ( badStatus.includes( this.props.status ) ) {
					return;
				}

				if ( this.props.revisions.isEmpty() ) {
					return;
				}

				return this.props.fetchList( new Set( [ this.props.revisions.last().user ] ) );
			} );
	}

	componentDidUpdate() {
		// Attemt to get more revisions if necessary.
		if ( this.invokeFetch ) {
			this.invokeFetch.next();
		}
	}

	componentWillUnmount() {
		this.infinite.unsubscribe();
	}

	isBottomVisable( element ) {
		const doc = element.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;
		const rect = element.getBoundingClientRect();
		const offset = 300;
		return ( rect.bottom - offset ) <= ( win.innerHeight || doc.documentElement.clientHeight );
	}

	render() {
		let prev;
		let edits;
		let userDisplay;

		if ( this.props.status !== 'notready' ) {
			edits = this.props.revisions.map( ( revision ) => {
				const timestamp = moment( revision.timestamp, moment.ISO_8601 );
				let date;
				let duration;

				if ( !prev || !timestamp.isSame( prev.timestamp, 'day' ) ) {
					date = timestamp;
				}

				// If we are switching sides, but not the date, show the duraction.
				if ( !date && prev && prev.user !== revision.user ) {
					duration = moment.duration( moment( prev.timestamp, moment.ISO_8601 ).diff( timestamp ) );
				}

				// Set the previous state for
				prev = revision;

				return (
					<RevisionContainer key={revision.id} date={date} duration={duration} revision={revision} />
				);
			} ).toArray();

			userDisplay = this.props.users.map( ( user ) => {
				return (
					<UserContainer key={user} user={user} />
				);
			} ).toArray();
		}

		return (
			<div className="timeline container-fluid">
				<div className="row no-gutters sticky-top justify-content-center">
					<div className="col-xl-10 col-sm-8">
						<div className="row align-items-center justify-content-around mb-3 text-center">
							{userDisplay}
						</div>
					</div>
				</div>
				<div className="edits" ref={( container ) => { this.container = container; }}>
					{edits}
				</div>
				<StatusContainer />
			</div>
		);
	}
}

Timeline.propTypes = {
	users: PropTypes.instanceOf( Set ).isRequired,
	revisions: PropTypes.instanceOf( Map ).isRequired,
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default Timeline;
