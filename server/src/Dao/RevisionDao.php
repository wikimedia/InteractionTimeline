<?php

namespace App\Dao;

use Doctrine\DBAL\Connection;

class RevisionDao extends AbstractDao {

	/**
	 * @param string[] $users
	 * @param null $startDate
	 * @param null $endDate
	 * @param int $limit
	 * @param null $continue
	 * @return array
	 */
	public function getUserRevisionsInCommonPages(
		$users, $startDate = null, $endDate = null, $limit = 50, $continue = null
	) {
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
	public function getRevisionDetails( $revIds ) {
		$query = $this->conn->createQueryBuilder();
		$fields = [
			'r.rev_id',
			'r.rev_page',
			'page_namespace',
			'page_title',
			'r.rev_user_text',
			'r.rev_timestamp',
			'r.rev_minor_edit',
			'r.rev_len',
			'r.rev_len - IFNULL(r2.rev_len, 0) as sizediff',
			'r.rev_comment',
			'r.rev_deleted'
		];
		$query->select( $fields )
			->from( 'revision_userindex', 'r' )
			->join( 'r', 'page', 'p', 'r.rev_page = page_id' )
			->leftJoin( 'r', 'revision_userindex', 'r2', 'r.rev_parent_id = r2.rev_id' )
			->where( 'r.rev_id in (:rev_ids)' )
			->orderBy( 'r.rev_timestamp', 'asc' )
			->setParameter( ':rev_ids', $revIds, Connection::PARAM_STR_ARRAY );

		$stmt = $query->execute();
		return $stmt->fetchAll( \PDO::FETCH_ASSOC );
	}
}
