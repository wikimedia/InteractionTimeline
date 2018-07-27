import React from 'react';
import PropTypes from 'prop-types';
import { Message } from '@wikimedia/react.i18n';
import moment from 'moment';
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
			isOpen: false
		};

		this.textArea = React.createRef();
		this.toggle = this.toggle.bind( this );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( !prevState.isOpen && this.state.isOpen ) {
			this.textArea.current.select();
		}
	}

	toggle() {
		this.setState( {
			...this.state,
			isOpen: !this.state.isOpen
		} );
	}

	render() {
		const dateFormat = 'YYYY-MM-DD';
		const title = <Message id="discuss-on-wiki" />;
		const text = Message( {
			id: 'discuss-on-wiki-text',
			placeholders: [
				this.props.startDate ? this.props.startDate.format( dateFormat ) : '2000-01-01',
				this.props.endDate ? this.props.startDate.format( dateFormat ) : moment.utc().format( dateFormat ),
				this.props.wiki ? this.props.wiki.domain : null,
				...this.props.users,
				'https://tools.wmflabs.org/interaction-timeline/' + this.props.queryString,
				this.props.editorInteractUrl
			]
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
							<Input type="textarea" rows={5} defaultValue={text} innerRef={this.textArea} />
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
