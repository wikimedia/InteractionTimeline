<?php

$dotenv = new Dotenv\Dotenv( __DIR__ . '/../' );
$dotenv->load();

return [
	'settings' => [
		// slim
		'displayErrorDetails' => getenv( 'DEBUG' ),
		'determineRouteBeforeAppMiddleware' => true,
		'db' => [
			'cluster' => getenv( 'DB_CLUSTER' ),
			'user' => getenv( 'DB_USER' ),
			'pass' => getenv( 'DB_PASS' ),
			'port' => getenv( 'DB_PORT' ),
			'driver' => getenv( 'DB_DRIVER' ),
		],
		'redis' => [
			'host' => getenv( 'REDIS_HOST' ),
			'port' => getenv( 'REDIS_PORT' ),
			'prefix' => getenv( 'REDIS_KEY_PREFIX' ),
		],

		// monolog settings
		'logger' => [
			'name' => 'app',
			'path' => getenv( 'LOGGER_PATH' ) ?: 'php://stderr',
			'level' => Monolog\Logger::DEBUG
		],
	],
];
