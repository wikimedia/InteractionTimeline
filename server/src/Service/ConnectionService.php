<?php

namespace App\Service;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;

class ConnectionService implements ConnectionServiceInterface {

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var Connection
	 */
	private $conn;

	/**
	 * @param array $config
	 */
	public function __construct( $config ) {
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
			$config = [
				'dbname' => $this->getDBName( $wiki ),
				'user' => $this->config['user'],
				'password' => $this->config['pass'],
				'host' => $this->getHost( $wiki ),
				'port' => $this->config['port'],
				'driver' => $this->config['driver']
			];

			$conn = DriverManager::getConnection( $config );
			$this->conn = $conn;
		}

		return $conn;
	}

	/**
	 * @param string $wiki
	 * @return string
	 */
	private function getHost( $wiki ) {
		return $wiki . '.' . $this->config['cluster'];
	}

	/**
	 * @param string $wiki
	 * @return string
	 */
	private function getDBName( $wiki ) {
		return $wiki . '_p';
	}
}
