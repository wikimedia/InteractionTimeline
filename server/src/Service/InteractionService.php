<?php

namespace App\Service;

use App\Dao\RevisionDao;

class InteractionService {

	/**
	 * @var RevisionDao
	 */
	private $revisionDao;

	/**
	 * @param RevisionDao $revisionDao
	 */
	public function __construct( RevisionDao $revisionDao ) {
		$this->revisionDao = $revisionDao;
	}

	/**
	 * @param array $users
	 * @param null $startDate
	 * @param null $endDate
	 * @param int $limit
	 * @param null $continue
	 * @return array
	 */
	public function getInteraction( $users, $startDate = null, $endDate = null, $limit = 50, $continue = null ) {
		$this->validateLimit( $limit );

		list( $revisionIds, $continue ) = $this->revisionDao->getUserRevisionsInCommonPages( $users,  $startDate, $endDate, $limit, $continue );
		$interaction = $this->revisionDao->getRevisionInteractionDetails( $revisionIds );

		return [ $interaction, $continue ];
	}

	/**
	 * @param $limit
	 * @throws InvalidArgumentException
	 */
	private function validateLimit( $limit ) {
		if ( $limit <= 0 ) {
			throw new \InvalidArgumentException( 'limit may not be less than 1' );
		}
	}
}
