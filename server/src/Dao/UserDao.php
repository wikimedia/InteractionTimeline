<?php

namespace App\Dao;

class UserDao extends AbstractDao {
	/**
	 * Get user id from username
	 *
	 * @param string $username
	 * @return bool|string
	 */
	public function getUserId( $username ) {
		$query = $this->conn->createQueryBuilder();
		$query->select( 'user_id' )
			->from( 'user' )
			->where( 'user_name = :user' )
			->setParameter( ':user', $username, \PDO::PARAM_STR );

		$stmt = $query->execute();
		$userId = $stmt->fetchColumn();

		return $userId;
	}
}
