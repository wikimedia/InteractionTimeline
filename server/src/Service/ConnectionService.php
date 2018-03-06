<?php

namespace App\Service;

use Doctrine\DBAL\Configuration;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;

class ConnectionService implements ConnectionServiceInterface {

	/**
	 * @var array
	 */
	private $params;

	/**
	 * @var Configuration
	 */
	private $config;

	/**
	 * @var Connection
	 */
	private $conn;

	/**
	 * @param array $params
	 * @param Configuration $config
	 */
	public function __construct( $params, Configuration $config ) {
		$this->params = $params;
		$this->config = $config;
	}

	/**
	 * @return Connection
	 * @throws \Exception
	 */
	public function getConnection() {
		if ( !$this->conn ) {
			throw new \Exception( 'no connection' );
		}

		return $this->conn;
	}

	/**
	 * @param string $wiki
	 * @return Connection
	 */
	public function connect( $wiki ) {
		if ( !isset( $this->conn ) ) {
			$params = [
				'dbname' => $this->getDBName( $wiki ),
				'user' => $this->params['user'],
				'password' => $this->params['pass'],
				'host' => $this->getHost( $wiki ),
				'port' => $this->params['port'],
				'driver' => $this->params['driver']
			];

			$this->conn = DriverManager::getConnection( $params, $this->config );
		}

		return $this->conn;
	}

	/**
	 * @param string $wiki
	 * @return string
	 */
	private function getHost( $wiki ) {
		return $wiki . '.' . $this->params['cluster'];
	}

	/**
	 * @param string $wiki
	 * @return string
	 */
	private function getDBName( $wiki ) {
		return $wiki . '_p';
	}
}
