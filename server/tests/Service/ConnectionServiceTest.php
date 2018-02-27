<?php

use App\Service\ConnectionService;
use PHPUnit\Framework\TestCase;

class ConnectionServiceTest extends TestCase {

	public function testGetConnectionFail() {
		$service = new ConnectionService( [] );

		$this->expectException( \Exception::class );
		$service->getConnection();
	}
}
