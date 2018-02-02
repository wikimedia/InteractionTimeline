<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require __DIR__ . '/../../server/vendor/autoload.php';

$app = new \Slim\App;
$app->get('/hello[/{name}]', function (Request $request, Response $response, array $args) {
	$name = $args['name'] ?: 'world';
	$response->getBody()->write("Hello, $name");

	return $response;
});
$app->run();
