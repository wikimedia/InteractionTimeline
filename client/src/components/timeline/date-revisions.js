import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import DateList from './date-list';

class DateRevisions extends React.Component {

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

				return this.props.fetchList();
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
		return (
			<div className="row date-revisions" ref={( container ) => { this.container = container; }}>
				<div className="col ml-3 mr-3 pt-3">
					<DateList revisions={this.props.revisions} />
				</div>
			</div>
		);
	}
}

DateRevisions.propTypes = {
	revisions: PropTypes.instanceOf( Map ).isRequired,
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default DateRevisions;
