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

$container['dbalCache'] = function ( $c ) {
	return new Doctrine\Common\Cache\FilesystemCache( __DIR__ . '/../cache' );
};

$container['connectionService'] = function ( $c ) {
	$params = $c->get( 'settings' )['db'];
	$cache = $c->get( 'dbalCache' );

	$config = new \Doctrine\DBAL\Configuration();
	$config->setResultCacheImpl( $cache );

	$connManager = new App\Service\ConnectionService( $params, $config );

	return $connManager;
};

$container['revisionDao'] = function ( $c ) {
	return new App\Dao\RevisionDao(
		$c->get( 'connectionService' ),
		$c->get( 'logger' )
	);
};

$container['userDao'] = function ( $c ) {
	return new App\Dao\UserDao(
		$c->get( 'connectionService' ),
		$c->get( 'logger' )
	);
};

$container['interactionService'] = function ( $c ) {
	$revisionDao = $c->get( 'revisionDao' );
	$userDao = $c->get( 'userDao' );
	$service = new App\Service\InteractionService( $revisionDao, $userDao );
	return $service;
};

// routes
$container[App\Action\InteractionAction::class] = function ( $c ) {
	$service = $c->get( 'interactionService' );
	return new App\Action\InteractionAction( $service );
};
