<?php

namespace App\Dao;

use App\Service\ConnectionServiceInterface;
use Psr\Log\LoggerInterface;
use Doctrine\DBAL\Query\QueryBuilder;

abstract class AbstractDao {
	/**
	 * @var \Doctrine\DBAL\Connection
	 */
	protected $conn;

	/**
	 * @var
	 */
	protected $logger;

	/**
	 * @param ConnectionServiceInterface $connectionService
	 * @param LoggerInterface $logger
	 */
	public function __construct(
		ConnectionServiceInterface $connectionService, LoggerInterface $logger
	) {
		$this->conn = $connectionService->getConnection();
		$this->logger = $logger;
	}

	/**
	 * @param QueryBuilder $qb
	 * @param string $key
	 * @param string $sortDir
	 * @param string $continue
	 * @param int $fetchMode
	 * @return array [ results, continue ]
	 * @throws \Exception
	 */
	public function paginate(
		QueryBuilder $qb, $key, $sortDir, $continue, $fetchMode = \PDO::FETCH_ASSOC
	) {
		if ( $continue ) {
			$indexKey = base64_decode( $continue );
			$sortDir = ( $sortDir == 'asc' ) ? '>=' : '<=';
			$qb->andWhere( $key . ' ' . $sortDir . ' :indexKey' )
				->setParameter( ':indexKey', $indexKey );
		}

		$this->logger->debug( $qb->getSQL(), $qb->getParameters() );

		$limit = $qb->getMaxResults();
		$qb->setMaxResults( $limit + 1 );

		$stmt = $qb->execute();
		$results = $stmt->fetchAll( $fetchMode );

		// if we have limit + 1, create continue token and remove extra row
		if ( count( $results ) > $limit ) {
			$lastRow = array_pop( $results );
			switch ( $fetchMode ) {
				case \PDO::FETCH_ASSOC:
					$continue = base64_encode( $lastRow[$key] );
					break;
				case \PDO::FETCH_COLUMN:
					$continue = base64_encode( $lastRow );
					break;
				default:
					throw new \Exception( 'unsupported fetch mode for paginating data' );
			}
		} else {
			$continue = null;
		}

		return [ $results, $continue ];
	}
}
