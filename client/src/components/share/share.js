import React from 'react';
import PropTypes from 'prop-types';
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
import Message from 'app/components/i18n/message';

class Share extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			isOpen: false
		};

		this.toggle = this.toggle.bind( this );
	}

	toggle() {
		this.setState( {
			isOpen: !this.state.isOpen
		} );
	}

	render() {
		const title = <Message id="discuss-on-wiki" />;
		const text = Message( {
			id: 'discuss-on-wiki-text'
		} );

		const buttonClassName = [
			'btn-share',
			this.props.empty ? 'empty' : ''
		];

		return (
			<React.Fragment>
				<Button color="light" className={buttonClassName.join( ' ' )} onClick={this.toggle}>
					<i className="material-icons align-bottom">comment</i> {title}
				</Button>
				<Modal isOpen={this.state.isOpen} toggle={this.toggle} centered size="lg">
					<ModalHeader toggle={this.toggle}>{title}</ModalHeader>
					<ModalBody>
						<Form>
							<Input type="textarea" rows={5} defaultValue={text} />
							<FormText color="muted">
								<Message id="discus-on-wiki-help" />
							</FormText>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="danger" onClick={this.toggle}>Close</Button>
					</ModalFooter>
				</Modal>
			</React.Fragment>
		);
	}
}

Share.propTypes = {
	empty: PropTypes.bool.isRequired
};

export default Share;
