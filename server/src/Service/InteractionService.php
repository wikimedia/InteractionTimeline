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
	 * @param string[] $users
	 * @param int|null $startDate
	 * @param int|null $endDate
	 * @param int $limit
	 * @param string|null $continue
	 * @return array
	 */
	public function getInteraction(
		$users, $startDate = null, $endDate = null, $limit = 50, $continue = null
	) {
		$this->validateLimit( $limit );

		list( $revisionIds, $continue ) = $this->revisionDao->getUserRevisionsInCommonPages(
				$users,  $startDate, $endDate, $limit, $continue
		);

		$revisions = $this->revisionDao->getRevisionDetails( $revisionIds );
		$revisions = $this->parseAndMapRevisions( $revisions );

		return [ $revisions, $continue ];
	}

	/**
	 * @param int[] $revisions
	 * @return array
	 */
	private function parseAndMapRevisions( $revisions ) {
		$interaction = [];
		foreach ( $revisions as $revision ) {
			$revision = [
				'id' => $revision['rev_id'],
				'pageid' => $revision['rev_page'],
				'title' => $this->buildTitle( $revision['page_namespace'], $revision['page_title'] ),
				'user' => $revision['rev_user_text'],
				'timestamp' => strtotime( $revision['rev_timestamp'] ),
				'minor' => !!$revision['rev_minor_edit'],
				'sizediff' => $revision['sizediff'],
				'comment' => $revision['rev_comment'],
				'commenthidden' => !!$revision['rev_deleted'],
				'suppressed' => !!$revision['rev_deleted'],
			];

			$interaction[] = $revision;
		}

		return $interaction;
	}

	/**
	 * @param int $ns
	 * @param string $title
	 * @return string
	 */
	private function buildTitle( $ns, $title ) {
		// TODO: fix this
		return str_replace( '_', ' ', $title );
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
