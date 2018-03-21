<?php

namespace App\Dao;

use App\Service\ConnectionServiceInterface;
use Doctrine\DBAL\Cache\QueryCacheProfile;
use Psr\Log\LoggerInterface;
use Doctrine\DBAL\Query\QueryBuilder;

abstract class AbstractDao {
	/**
	 * Cache TTL default value
	 */
	const CONST_CACHE_TTL = 86400;

	/**
	 * @var \Doctrine\DBAL\Connection
	 */
	protected $conn;

	/**
	 * @var LoggerInterface
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
	protected function paginate(
		QueryBuilder $qb, $key, $sortDir, $continue, $fetchMode = \PDO::FETCH_ASSOC
	) {
		if ( $continue ) {
			$indexKey = base64_decode( $continue );
			$sortDir = ( $sortDir == 'asc' ) ? '>=' : '<=';
			$qb->andWhere( $key . ' ' . $sortDir . ' :indexKey' )
				->setParameter( ':indexKey', $indexKey );
		}

		$limit = $qb->getMaxResults();
		$qb->setMaxResults( $limit + 1 );

		$results = $this->fetchAll( $qb, $fetchMode, true );

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

	/**
	 * Fetch all with the option of caching results
	 *
	 * @param QueryBuilder $qb
	 * @param int $fetchMode
	 * @param bool $cache
	 * @param int $ttl
	 * @return array
	 */
	protected function fetchAll(
		QueryBuilder $qb, $fetchMode, $cache = false, $ttl = self::CONST_CACHE_TTL
	) {
		if ( $cache ) {
			$qpf = new QueryCacheProfile( $ttl );
		}

		$stmt = $this->conn->executeQuery(
			$qb->getSQL(),
			$qb->getParameters(),
			$qb->getParameterTypes(),
			isset( $qpf ) ? $qpf : null
		);

		$results = $stmt->fetchAll( $fetchMode );

		// this is where Doctrine DBAL caches results
		$stmt->closeCursor();

		return $results;
	}
}
