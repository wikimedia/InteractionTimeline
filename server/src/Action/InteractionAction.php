<?php

namespace App\Action;

use App\Service\InteractionService;
use Slim\Http\Request;
use Slim\Http\Response;

class InteractionAction {

	/**
	 * @var InteractionService
	 */
	private $service;

	/**
	 * InteractionAction constructor.
	 * @param InteractionService $service
	 */
	public function __construct( InteractionService $service ) {
		$this->service = $service;
	}

	/**
	 * @param Request $request
	 * @param Response $response
	 * @param array $args
	 * @return Response
	 */
	public function __invoke( Request $request, Response $response, $args ) {
		$users = $this->parseUsers( $request->getQueryParam( 'user', null ) );
		$startDate = $request->getQueryParam( 'start_date', null );
		$endDate = $request->getQueryParam( 'end_date', null );
		$limit = $request->getQueryParam( 'limit', 50 );
		$continue = $request->getQueryParam( 'continue', null );

		list( $interaction, $continue ) =
			$this->service->getInteraction( $users, $startDate, $endDate, $limit, $continue );

		if ( $continue ) {
			$ret['continue'] = $continue;
		}

		$ret['data'] = $interaction;

		return $response->withJson( $ret )->withHeader( 'Access-Control-Allow-Origin', '*' );
	}

	/**
	 * @param string $users
	 * @return array
	 */
	private function parseUsers( $users ) {
		return explode( '|', $users );
	}
}
