<?php

namespace App\Dao;

use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

abstract class AbstractDao {

	/**
	 * @var NullLogger
	 */
	protected $logger;

	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var array [dsn => pdo]
	 */
	protected $connections = [];

	/**
	 * AbstractDao constructor.
	 *
	 * @param array $config
	 * @param LoggerInterface|null $logger
	 */
	public function __construct( $config, LoggerInterface $logger = null ) {
		$this->logger = $logger ?: new NullLogger();
		$this->config = $config;
	}

	/**
	 * @param string $projectName
	 * @return \PDO
	 */
	public function getDb( $projectName ) {
		$dsn = $this->buildDsn( $projectName );

		if ( isset( $this->connections[$dsn] ) ) {
			$pdo = $this->connections[$dsn];
		} else {
			$pdo = $this->connect( $dsn );
			$this->connections[$dsn] = $pdo;
		}

		return $pdo;
	}

	/**
	 * @param string $dsn
	 * @return \PDO
	 */
	protected function connect( $dsn ) {
		// TODO: try/catch
		$pdo = new \PDO( $dsn, $this->config['user'], $this->config['pass'] );
		$pdo->setAttribute( \PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION );
		$pdo->setAttribute( \PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC );

		return $pdo;
	}

	/**
	 * @param string $projectName
	 * @return string
	 */
	private function buildDsn( $projectName ) {
		$host = $projectName . '.' . $this->config['cluster'];
		$dbname = $this->getDBName( $projectName );
		$port = $this->config['port'];
		$dsn = 'mysql:host='. $host . ';dbname=' . $dbname . ';port=' . $port;

		return $dsn;
	}

	/**
	 * @param string $projectName
	 * @return string
	 */
	private function getDBName( $projectName ) {
		return $projectName . '_p';
	}

	/**
	 * @param string $sql
	 * @param null $params
	 * @return array
	 */
	protected function fetchAll( $sql, $params = null ) {
		$this->logger->debug( $sql, $params );

		$stmt = $this->db->prepare( $sql, $params );
		$stmt->execute();

		return $stmt->fetchAll();
	}

	/**
	 * @param string $sql
	 * @param null $params
	 * @return mixed
	 */
	protected function fetch( $sql, $params = null ) {
		$this->logger->debug( $sql, $params );

		$stmt = $this->db->prepare( $sql, $params );
		$stmt->execute();

		return $stmt->fetch();
	}
}
