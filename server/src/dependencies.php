<?php

$container = $app->getContainer();

// monolog
$container['logger'] = function ( $c ) {
	$settings = $c->get( 'settings' );
	$logger = new Monolog\Logger( $settings['logger']['name'] );
	$handler = new Monolog\Handler\StreamHandler( $settings['logger']['path'] );
	$logger->pushHandler( $handler, $settings['logger']['level'] );

	return $logger;
};

// error handler
$container['errorHandler'] = function ( $c ) {
	$logger = $c->get( 'logger' );
	return new App\AppErrorHandler( $logger );
};

$container['connectionService'] = function ( $c ) {
	$config = $c->get( 'settings' )['db'];
	$connManager = new App\Service\ConnectionService( $config );
	return $connManager;
};

$container['revisionDao'] = function ( $c ) {
	return new App\Dao\RevisionDao(
		$c->get( 'connectionService' ),
		$c->get( 'logger' )
	);
};

$container['interactionService'] = function ( $c ) {
	$revisionDao = $c->get( 'revisionDao' );
	$service = new App\Service\InteractionService( $revisionDao );
	return $service;
};

// routes
$container[App\Action\InteractionAction::class] = function ( $c ) {
	$service = $c->get( 'interactionService' );
	return new App\Action\InteractionAction( $service );
};
