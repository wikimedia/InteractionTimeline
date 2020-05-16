import React from 'react';
import PropTypes from 'prop-types';
import { Message, BananaContext } from '@wikimedia/react.i18n';
import moment from 'moment';
import clipboard from 'clipboard-polyfill';
import 'material-design-icons/iconfont/material-icons.css';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormText,
	Input
} from 'reactstrap';
import Wiki from 'app/entities/wiki';

class Share extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			isOpen: false,
			copied: false
		};

		this.textArea = React.createRef();
		this.toggle = this.toggle.bind( this );
		this.copyToClipboard = this.copyToClipboard.bind( this );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( !prevState.isOpen && this.state.isOpen && this.textArea.current ) {
			this.textArea.current.focus();
			this.textArea.current.select();
		}
	}

	getMessageText( banana ) {
		const dateFormat = 'YYYY-MM-DD';

		return banana.i18n(
			'discuss-on-wiki-text',
			this.props.startDate ? this.props.startDate.format( dateFormat ) : '2000-01-01',
			this.props.endDate ? this.props.endDate.format( dateFormat ) : moment.utc().format( dateFormat ),
			this.props.wiki ? this.props.wiki.domain : null,
			...this.props.users,
			'https://interaction-timeline.toolforge.org/' + this.props.queryString,
			this.props.editorInteractUrl
		);
	}

	copyToClipboard( banana ) {
		clipboard.writeText( this.getMessageText( banana ) ).then( () => {
			this.setState( {
				copied: true
			} );
		} );
	}

	toggle() {
		this.setState( {
			...this.state,
			// If the modal is being opened, clear the copied state.
			copied: this.state.isOpen ? this.state.copied : false,
			// Reverse the open state.
			isOpen: !this.state.isOpen
		} );
	}

	render() {
		const title = <Message id="discuss-on-wiki" />;

		const buttonClassName = [
			'btn-share',
			this.props.empty ? 'invisible' : 'visible'
		];

		const copiedMessage = this.state.copied ? 'discuss-on-wiki-copied' : 'discuss-on-wiki-copy';

		return (
			<React.Fragment>
				<Button color="light" className={buttonClassName.join( ' ' )} onClick={this.toggle}>
					<i className="material-icons align-bottom">comment</i> {title}
				</Button>
				<Modal isOpen={this.state.isOpen} toggle={this.toggle} centered size="lg">
					<ModalHeader toggle={this.toggle}>{title}</ModalHeader>
					<ModalBody>
						<Form>
							<BananaContext.Consumer>
								{banana => (
									<Input type="textarea" rows={6} defaultValue={this.getMessageText( banana )} innerRef={this.textArea} />
								)}
							</BananaContext.Consumer>
							<FormText color="muted">
								<Message id="discuss-on-wiki-help" />
							</FormText>
						</Form>
					</ModalBody>
					<ModalFooter>
						<BananaContext.Consumer>
							{banana => (
								<Button color="primary" onClick={() => this.copyToClipboard( banana )}><Message id={copiedMessage} /></Button>
							)}
						</BananaContext.Consumer>
					</ModalFooter>
				</Modal>
			</React.Fragment>
		);
	}
}

Share.propTypes = {
	empty: PropTypes.bool.isRequired,
	users: PropTypes.arrayOf( PropTypes.string ).isRequired,
	queryString: PropTypes.string.isRequired,
	startDate: PropTypes.instanceOf( moment ),
	endDate: PropTypes.instanceOf( moment ),
	wiki: PropTypes.instanceOf( Wiki ),
	editorInteractUrl: PropTypes.string
};

Share.defaultProps = {
	startDate: undefined,
	endDate: undefined,
	wiki: undefined,
	editorInteractUrl: undefined
};

export default Share;
