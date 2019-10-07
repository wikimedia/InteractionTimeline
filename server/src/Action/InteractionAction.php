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
		$users = $this->parseListQueryParam( $request->getQueryParam( 'user', null ) );
		$namespaces = $this->parseListQueryParam( $request->getQueryParam( 'namespace', null ) );
		$startDate = $request->getQueryParam( 'start_date', null );
		$endDate = $request->getQueryParam( 'end_date', null );
		$limit = $request->getQueryParam( 'limit', 50 );
		$continue = $request->getQueryParam( 'continue', null );

		list( $interaction, $continue ) =
			$this->service->getInteraction( $users, $namespaces, $startDate, $endDate, $limit, $continue );

		if ( $continue ) {
			$ret['continue'] = $continue;
		}

		$ret['data'] = $interaction;

		return $response->withJson( $ret );
	}

	/**
	 * @param string $param
	 * @return array
	 */
	private function parseListQueryParam( $param ) {
		$params = [];
		if ( !is_null( $param ) ) {
			$params = explode( '|', $param );
		}

		return $params;
	}
}
