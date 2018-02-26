<?php

namespace App\Dao;

use Doctrine\DBAL\Connection;

class RevisionDao extends AbstractDao {

	/**
	 * @param $users
	 * @param null $startDate
	 * @param null $endDate
	 * @param int $limit
	 * @param null $continue
	 * @return array
	 */
	public function getUserRevisionsInCommonPages( $users, $startDate = null, $endDate = null, $limit = 50, $continue = null ) {
		// build subquery to find common pages between users
		$subQuery = $this->conn->createQueryBuilder();
		$subQuery->select( 'rev_page' )
			->from( 'revision_userindex' )
			->where( 'rev_user_text in (:users)' )
			->groupBy( 'rev_page' )
			->having( 'count(distinct rev_user) > 1' );

		// build query to find interaction between users in common pages
		$query = $this->conn->createQueryBuilder();
		$query->select( 'rev_id' )
			->from( 'revision_userindex', 'r' )
			->where( 'rev_user_text in (:users)' )
			->andWhere( $query->expr()->in( 'rev_page', $subQuery->getSQL() ) )
			->orderBy( 'rev_timestamp', 'asc' )
			->setMaxResults( $limit )
			->setParameter( ':users', $users, Connection::PARAM_STR_ARRAY );

		if ( $startDate ) {
			$query->andWhere( 'rev_timestamp >= :start_date' )
				->setParameter( ':start_date', date( 'Ymdhmi', $startDate ) );
		}

		if ( $endDate ) {
			$query->andWhere( 'rev_timestamp <= :end_date' )
				->setParameter( ':end_date', date( 'Ymdhmi', $endDate ) );
		}
		$this->logger->debug( sprintf( "Fetching revisions for users: %s", join( ', ', $users ) ) );

		return $this->paginate( $query, 'rev_id', 'asc', $continue, \PDO::FETCH_COLUMN );
	}

	/**
	 * @param int[] $revIds
	 * @return array
	 */
	public function getRevisionInteractionDetails( $revIds ) {
		$query = $this->conn->createQueryBuilder();
		$fields = [
			'rev_id',
			'rev_page',
			'page_title',
			'rev_user_text',
			'rev_timestamp',
			'rev_minor_edit',
			'rev_len',
			'rev_comment',
			'rev_deleted'
		];
		$query->select( $fields )
			->from( 'revision_userindex', 'r' )
			->join( 'r', 'page', 'p', 'rev_page = page_id' )
			->where( 'rev_id in (:rev_ids)' )
			->orderBy( 'rev_timestamp', 'asc' )
			->setParameter( ':rev_ids', $revIds, Connection::PARAM_STR_ARRAY );

		$stmt = $query->execute();
		$interaction = [];
		while ( $row = $stmt->fetch() ) {
			$revision = [
				'id' => $row['rev_id'],
				'pageid' => $row['rev_page'],
				'title' => $row['page_title'], // TODO: this has to be built
				'user' => $row['rev_user_text'],
				'timestamp' => strtotime( $row['rev_timestamp'] ),
				'minor' => $row['rev_minor_edit'],
				'sizediff' => 0, // TODO,
				'comment' => $row['rev_comment'],
				'commenthidden' => false, // TODO
				'suppressed' => $row['rev_deleted'],
			];

			$interaction[] = $revision;
		}

		return $interaction;
	}
	/**
	 * @param array $revIds
	 */
	public function getRevisionSizeDiff( $revIds ) {
	}
}
