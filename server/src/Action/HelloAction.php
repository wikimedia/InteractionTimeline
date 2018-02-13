<?php

namespace App\Action;

use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

class HelloAction {

	/**
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * @var LoggerInterface
	 */
	private $logger;

	/**
	 * HelloAction constructor.
	 * @param ContainerInterface $container
	 */
	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
		$this->logger = $this->container->get( 'logger' );
	}

	/**
	 * @param Request $request
	 * @param Response $response
	 * @param array $args
	 * @return Response
	 */
	public function __invoke( Request $request, Response $response, $args ) {
		$this->logger->debug( 'Hello action dispatched' );

		return $response->withJson( 'Hello' );
	}
}
