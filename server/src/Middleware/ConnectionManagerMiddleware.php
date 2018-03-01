<?php

namespace App\Middleware;

use App\Service\ConnectionService;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class ConnectionManagerMiddleware {
	/**
	 * @var ConnectionService
	 */
	private $connService;

	/**
	 * @param ConnectionService $connService
	 */
	public function __construct( ConnectionService $connService ) {
		$this->connService = $connService;
	}

	/**
	 * Reads the project name Ex. enwiki from the route
	 * and creates a connection to the corresponding HOST/DB
	 *
	 * @param ServerRequestInterface $request
	 * @param ResponseInterface $response
	 * @param callable $next
	 * @return ResponseInterface
	 */
	public function __invoke(
		ServerRequestInterface $request, ResponseInterface $response, callable $next
	) {
		$projectName = $request->getAttribute( 'route' )->getArgument( 'project' );
		$this->connService->connect( $projectName );

		$response = $next( $request, $response );

		return $response;
	}
}
