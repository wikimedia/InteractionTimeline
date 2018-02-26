<?php

namespace App;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

class AppErrorHandler {

	/**
	 * @var LoggerInterface
	 */
	private $logger;

	public function __construct( LoggerInterface $logger ) {
		$this->logger = $logger;
	}

	/**
	 * @param ServerRequestInterface $request
	 * @param ResponseInterface $response
	 * @param \Exception $e
	 * @return ResponseInterface $response
	 */
	public function __invoke( ServerRequestInterface $request, ResponseInterface $response, \Exception $e ) {
		$errorCode = $e->getCode() ?: 400;
		$message = $e->getMessage();

		// maybe we shouldn't log everything
		$this->logger->error( $message, [ $e->getTraceAsString() ] );

		return $response
			->withStatus( $errorCode )
			->withHeader( 'Content-Type', 'application/json' )
			->withJson( [ 'message' => $message ] );
	}
}
