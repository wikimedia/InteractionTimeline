<?php

$dotenv = new Dotenv\Dotenv( __DIR__ . '/../' );
$dotenv->load();

return [
	'settings' => [
		// slim
		'displayErrorDetails' => getenv( 'DEBUG' ),

		// db
		'db' => [
			'cluster' => getenv( 'DB_CLUSTER' ),
			'user' => getenv( 'DB_USER' ),
			'pass' => getenv( 'DB_PASS' ),
			'port' => getenv( 'DB_PORT' ),
		],

		// monolog settings
		'logger' => [
			'name' => 'app',
			'path' => getenv( 'LOGGER_PATH' ) ?: 'php://stderr',
			'level' => Monolog\Logger::DEBUG
		],
	],
];
