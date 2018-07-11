import React from 'react';
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
		return (
			<React.Fragment>
				<Button color="light" className="btn-share" onClick={this.toggle}>
					<i className="material-icons align-bottom">comment</i> {title}
				</Button>
				<Modal isOpen={this.state.isOpen} toggle={this.toggle} centered size="lg">
					<ModalHeader toggle={this.toggle}>{title}</ModalHeader>
					<ModalBody>
						<Form>
							<Input type="textarea" rows={5} defaultValue={text} />
							<FormText color="muted">
								Copy & paste this wikitext to an on-wiki discussion to share these Interaction Timeline results with others
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

export default Share;
