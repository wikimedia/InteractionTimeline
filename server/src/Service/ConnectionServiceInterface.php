<?php

namespace App\Service;

use Doctrine\DBAL\Connection;

interface ConnectionServiceInterface {

	/**
	 * Connects to a database and returns a connection
	 *
	 * @param string $wiki
	 * @return Connection
	 */
	public function connect( $wiki );

	/**
	 * Returns an existing connection or fails if there isn't one
	 *
	 * @return Connection
	 */
	public function getConnection();
}
