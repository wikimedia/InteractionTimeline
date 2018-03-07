<?php

use App\Service\ConnectionService;
use PHPUnit\Framework\TestCase;

class ConnectionServiceTest extends TestCase {

	public function testGetConnectionFail() {
		$config = $this->createMock( \Doctrine\DBAL\Configuration::class );
		$service = new ConnectionService( [], $config );

		$this->expectException( \Exception::class );
		$service->getConnection();
	}
}
