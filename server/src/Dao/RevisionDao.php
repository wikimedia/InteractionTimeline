<?php

namespace App\Dao;

use Doctrine\DBAL\Connection;

class RevisionDao extends AbstractDao {

	/**
	 * Fetch user interaction in commonly edited pages
	 *
	 * @param array $users List of usernames/IPs or user ids
	 * @param \DateTimeInterface|null $startDate
	 * @param \DateTimeInterface|null $endDate
	 * @param int $limit
	 * @param null $continue
	 * @return array
	 */
	public function getUserRevisionsInCommonPages(
		array $users, \DateTimeInterface $startDate = null, \DateTimeInterface $endDate = null,
		$limit = 50, $continue = null
	) {
		$pages = $this->getUsersCommonPages( $users, $startDate, $endDate );

		// build query to find interaction between users in common pages
		$query = $this->conn->createQueryBuilder();
		$searchColumn = $this->getUserSearchColumn( $users );
		$query->select( 'rev_id' )
			->from( 'revision_userindex', 'r' )
			->join( 'r', 'actor', 'a', 'r.rev_actor = a.actor_id' )
			->where( $searchColumn . ' in (:users)' )
			->andWhere( 'r.rev_page in (:pages)' )
			->orderBy( 'r.rev_id', 'asc' )
			->setMaxResults( $limit )
			->setParameter( ':users', $users, Connection::PARAM_STR_ARRAY )
			->setParameter( ':pages', $pages, Connection::PARAM_STR_ARRAY );

		if ( $startDate ) {
			$query->andWhere( 'r.rev_timestamp >= :start_date' )
				->setParameter( ':start_date', $startDate->format( 'YmdHis' ) );
		}

		if ( $endDate ) {
			$query->andWhere( 'r.rev_timestamp <= :end_date' )
				->setParameter( ':end_date', $endDate->format( 'YmdHis' ) );
		}
		$this->logger->debug( sprintf( "Fetching revisions for users: %s", join( ', ', $users ) ) );

		return $this->paginate( $query, 'rev_id', 'asc', $continue, \PDO::FETCH_COLUMN );
	}

	/**
	 * Get common edited pages between multiple users
	 *
	 * @param array $users List of usernames/IPs or user ids
	 * @param \DateTimeInterface|null $startDate
	 * @param \DateTimeInterface|null $endDate
	 * @return array
	 */
	public function getUsersCommonPages(
		array $users, \DateTimeInterface $startDate = null, \DateTimeInterface $endDate = null
	) {
		$query = $this->conn->createQueryBuilder();
		$searchColumn = $this->getUserSearchColumn( $users );
		$query->select( 'r.rev_page' )
			->from( 'revision_userindex', 'r' )
			->join( 'r', 'actor', 'a', 'r.rev_actor = a.actor_id' )
			->where( $searchColumn . ' in (:users)' )
			->groupBy( 'r.rev_page' )
			->having( 'count(distinct ' . $searchColumn . ') > 1' )
			->setParameter( ':users', $users, Connection::PARAM_STR_ARRAY );

		if ( $startDate ) {
			$query->andWhere( 'r.rev_timestamp >= :start_date' )
				->setParameter( ':start_date', $startDate->format( 'YmdHis' ) );
		}

		if ( $endDate ) {
			$query->andWhere( 'r.rev_timestamp <= :end_date' )
				->setParameter( ':end_date', $endDate->format( 'YmdHis' ) );
		}

		return $this->fetchAll( $query, \PDO::FETCH_COLUMN, true );
	}

	/**
	 * Get revision details
	 *
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
			'a.actor_name',
			'r.rev_timestamp',
			'r.rev_minor_edit',
			'r.rev_len',
			'r.rev_len - IFNULL(r2.rev_len, 0) as sizediff',
			'c.comment_text AS rev_comment',
			'r.rev_deleted'
		];
		$query->select( $fields )
			->from( 'revision_userindex', 'r' )
			->join( 'r', 'page', 'p', 'r.rev_page = p.page_id' )
			->join( 'r', 'actor', 'a', 'r.rev_actor = a.actor_id' )
			->leftJoin( 'r', 'comment', 'c', 'r.rev_comment_id = c.comment_id' )
			->leftJoin( 'r', 'revision_userindex', 'r2', 'r.rev_parent_id = r2.rev_id' )
			->where( 'r.rev_id in (:rev_ids)' )
			->orderBy( 'r.rev_timestamp', 'asc' )
			->setParameter( ':rev_ids', $revIds, Connection::PARAM_STR_ARRAY );

		return $this->fetchAll( $query, \PDO::FETCH_ASSOC );
	}

	/**
	 * Determine user's search column on revisions table.
	 *
	 * When possible, search for user ids to improve performance.
	 * If usernames or IP(s) are provided, then use those.
	 *
	 * @param array $users List of usernames/IPs or user ids
	 * @return string
	 */
	private function getUserSearchColumn( array $users ) {
		$column = 'a.actor_name';
		if ( $this->isNumericArray( $users ) ) {
			$column = 'a.actor_user';
		}

		return $column;
	}

	/**
	 * Determine if all the elements in an array are numeric.
	 *
	 * @param array $arr
	 * @return boolean
	 */
	private function isNumericArray( array $arr ) {
		foreach ( $arr as $value ) {
			if ( !is_numeric( $value ) ) {
				return false;
			}
		}

		return true;
	}
}
