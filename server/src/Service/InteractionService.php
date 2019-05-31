<?php

namespace App\Service;

use App\Dao\RevisionDao;
use App\Dao\UserDao;

class InteractionService {

	/**
	 * @var RevisionDao
	 */
	private $revisionDao;

	/**
	 * @var UserDao
	 */
	private $userDao;

	/**
	 * @param RevisionDao $revisionDao
	 * @param UserDao $userDao
	 */
	public function __construct( RevisionDao $revisionDao, UserDao $userDao ) {
		$this->revisionDao = $revisionDao;
		$this->userDao = $userDao;
	}

	/**
	 * @param string[] $users
	 * @param int|string|null $startDate
	 * @param int|string|null $endDate
	 * @param int $limit
	 * @param string|null $continue
	 * @return array
	 */
	public function getInteraction(
		array $users, $startDate = null, $endDate = null, $limit = 50, $continue = null
	) {
		$this->validateUsers( $users );
		$this->validateLimit( $limit );

		$startDate = $this->sanitizeDate( $startDate );
		$endDate = $this->sanitizeDate( $endDate );

		// If none of the users is an IP, get their user ID(s) to improve performance
		if ( !$this->isIpPresent( $users ) ) {
			// get user ids from usernames
			$users = array_map( function ( $username ) {
				$userId = $this->userDao->getUserId( $username );
				if ( !$userId ) {
					throw new \InvalidArgumentException( sprintf( 'username %s could not be found', $username ) );
				}
				return $userId;
			}, $users );
		}

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
	private function parseAndMapRevisions( array $revisions ) {
		$interaction = [];
		foreach ( $revisions as $revision ) {
			$revision = [
				'rev_id' => (int)$revision['rev_id'],
				'page_id' => (int)$revision['rev_page'],
				'page_title' => $this->buildTitle( $revision['page_title'] ),
				'page_namespace' => (int)$revision['page_namespace'],
				'user' => $revision['actor_name'],
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
	 * @param string $title
	 * @return string mixed
	 */
	private function buildTitle( $title ) {
		return str_replace( '_', ' ', $title );
	}

	/**
	 * @param int $limit
	 * @throws \InvalidArgumentException
	 */
	private function validateLimit( $limit ) {
		if ( $limit <= 0 ) {
			throw new \InvalidArgumentException( 'limit may not be less than 1' );
		}
	}

	/**
	 * @param string[] $users
	 * @throws \InvalidArgumentException
	 */
	private function validateUsers( array $users ) {
		if ( count( $users ) < 2 ) {
			throw new \InvalidArgumentException( 'at least 2 users should be provided' );
		}
	}

	/**
	 * Takes a timestamp or a string representing a date
	 * and returns a \DateTime object
	 *
	 * @param int|string $date
	 * @return \DateTime|null
	 * @throws \InvalidArgumentException
	 */
	private function sanitizeDate( $date ) {
		if ( $date ) {
			if ( is_numeric( $date ) ) {
				$dateObj = \DateTime::createFromFormat( 'U', $date );
			} else {
				$dateObj = \DateTime::createFromFormat( 'U', strtotime( $date ) );
				if ( !$dateObj ) {
					throw new \InvalidArgumentException( 'invalid date argument' );
				}
			}
		}

		return isset( $dateObj ) ? $dateObj : null;
	}

	/**
	 * Check if a value in an array is a valid IP address
	 *
	 * @param array $data
	 * @return boolean
	 */
	private function isIpPresent( array $data ) {
		foreach ( $data as $possibleIp ) {
			if ( filter_var( $possibleIp, FILTER_VALIDATE_IP ) ) {
				return true;
			}
		}

		return false;
	}
}
