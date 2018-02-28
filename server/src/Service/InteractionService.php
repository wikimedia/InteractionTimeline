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
		$this->validateUsers( $users );
		$this->validateLimit( $limit );

		list( $revisionIds, $continue ) = $this->revisionDao->getUserRevisionsInCommonPages(
				$users,  $startDate, $endDate, $limit, $continue
		);

		$revisions = [];
		if ( $revisionIds ) {
			$revisions = $this->revisionDao->getRevisionDetails( $revisionIds );
			$revisions = $this->parseAndMapRevisions( $revisions );
		}

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
				'rev_id' => (int)$revision['rev_id'],
				'page_id' => (int)$revision['rev_page'],
				'page_title' => $revision['page_title'],
				'page_namespace' => (int)$revision['page_namespace'],
				'user' => $revision['rev_user_text'],
				'timestamp' => strtotime( $revision['rev_timestamp'] ),
				'minor' => !!$revision['rev_minor_edit'],
				'size_diff' => (int)$revision['sizediff'],
				'comment' => $revision['rev_comment'],
				'comment_hidden' => !!$revision['rev_deleted'],
				'suppressed' => !!$revision['rev_deleted'],
			];

			$interaction[] = $revision;
		}

		return $interaction;
	}

	/**
	 * @param int $limit
	 * @throws InvalidArgumentException
	 */
	private function validateLimit( $limit ) {
		if ( $limit <= 0 ) {
			throw new \InvalidArgumentException( 'limit may not be less than 1' );
		}
	}

	/**
	 * @param string[] $users
	 * @throws InvalidArgumentException
	 */
	private function validateUsers( $users ) {
		if ( count( $users ) < 2 ) {
			throw new \InvalidArgumentException( 'at least 2 users should be provided' );
		}
	}
}
