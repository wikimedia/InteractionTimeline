import IntlProvider from './intl-provider';
import Message from './message';

test( 'will get a basic message string', () => {
	// eslint-disable-next-line no-unused-vars
	const provider = new IntlProvider( {
		locale: 'en',
		messages: {
			en: {
				test: 'TEST'
			}
		}
	} );

	const text = Message( {
		id: 'test'
	} );
	expect( text ).toStrictEqual( 'TEST' );
} );

test( 'will get a basic message string with a placeholder', () => {
	// eslint-disable-next-line no-unused-vars
	const provider = new IntlProvider( {
		locale: 'en',
		messages: {
			en: {
				test: 'TEST $1'
			}
		}
	} );

	const text = Message( {
		id: 'test',
		placeholders: [
			'RIGHT'
		]
	} );
	expect( text ).toStrictEqual( 'TEST RIGHT' );
} );

test( 'will get a basic message string with multiple placeholders', () => {
	// eslint-disable-next-line no-unused-vars
	const provider = new IntlProvider( {
		locale: 'en',
		messages: {
			en: {
				test: '$2 TEST $1'
			}
		}
	} );

	const text = Message( {
		id: 'test',
		placeholders: [
			'RIGHT',
			'LEFT'
		]
	} );
	expect( text ).toStrictEqual( 'LEFT TEST RIGHT' );
} );
