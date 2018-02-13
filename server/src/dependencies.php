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
