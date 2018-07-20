import React from 'react';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs';
import { Message } from '@wikimedia/react.i18n';
import createIntersectionObservable from 'app/utils/intersection';
import { Tooltip } from 'reactstrap';
import 'material-design-icons/iconfont/material-icons.css';
/* global Element */

class BackToTopButton extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			show: false,
			tooltipOpen: false
		};

		this.showButton = new Subject();
		this.handleClick = this.handleClick.bind( this );
		this.showTooltip = this.showTooltip.bind( this );
		this.hideTooltip = this.hideTooltip.bind( this );
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

	showTooltip() {
		this.setState( {
			...this.state,
			tooltipOpen: true
		} );
	}

	hideTooltip() {
		this.setState( {
			...this.state,
			tooltipOpen: false
		} );
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
			<div ref={( element ) => { this.container = element; }}>
				<button className={className.join( ' ' )} ref={( element ) => { this.button = element; }} onClick={this.handleClick} onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip}>
					<i className="material-icons align-middle">vertical_align_top</i> <span className="sr-only"><Message id="back-top" /></span>
				</button>
				<Tooltip placement="bottom" target={() => this.button} isOpen={this.state.tooltipOpen} container={this.container} autohide={false}>
					<Message id="back-top" />
				</Tooltip>
			</div>
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
