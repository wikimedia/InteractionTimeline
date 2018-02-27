import React from 'react';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs';
import createIntersectionObservable from 'app/utils/intersection';
/* global Element */

class BackToTopButton extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			show: false
		};

		this.showButton = new Subject();
		this.handleClick = this.handleClick.bind( this );
	}

	componentDidUpdate( prevProps ) {

		if ( prevProps.stickyHeader === this.props.stickyHeader ) {
			return;
		}

		this.showButton.unsubscribe();
		this.showButton = createIntersectionObservable( this.props.stickyHeader )
			.map( entry => !entry.isIntersecting )
			.subscribe( show => {
				this.setState( {
					...this.state,
					show
				} );
			} );
	}

	componentWillUnmount() {
		this.showButton.unsubscribe();
	}

	handleClick() {
		const doc = this.button.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;

		// Scroll the user to the top.
		// If the browser suppors smooth scrolling, use that.
		if ( win.scroll ) {
			win.scroll( {
				top: 0,
				behavior: 'smooth'
			} );
		} else {
			doc.body.scrollTop = doc.documentElement.scrollTop = 0;
		}
	}

	render() {
		const visibility = this.state.show ? 'visible' : 'invisible';

		const className = [
			'btn',
			'btn-link',
			'back-top',
			'text-muted',
			visibility
		];

		return (
			<button className={className.join( ' ' )} ref={( element ) => { this.button = element; }} onClick={this.handleClick}>
				{/* @TODO Translate */}
				<i className="material-icons align-middle">vertical_align_top</i> <span className="sr-only">Back to Top</span>
			</button>
		);
	}
}

BackToTopButton.propTypes = {
	stickyHeader: PropTypes.instanceOf( Element )
};

BackToTopButton.defaultProps = {
	stickyHeader: undefined
};

export default BackToTopButton;
