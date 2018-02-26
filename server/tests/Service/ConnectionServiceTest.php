<?php

use PHPUnit\Framework\TestCase;

class ConnectionServiceTest extends TestCase {

	public function xtestGetDb() {
		$conn = $this->createMock( \Doctrine\DBAL\Connection::class );
		$config = [
			'cluster' => 'test-cluster',
			'user' => 'test-user',
			'pass' => 'test-pass',
			'port' => 4711 ,
			'driver' => 'pdo_mysql',
		];

		$manager = $this->getMockBuilder( \App\ConnectionService::class )
			->setMethods( [ 'getConfig', 'connect' ] )
			->setConstructorArgs( [ $config ] )
			->getMock();

		$manager->expects( $this->once() )
			->method( 'connect' )
			->willReturn( $conn );

		$manager->expects( $this->once() )
			->method( 'getConfig' )
			->with()
			->willReturn( [
				'dbname' => 'enwiki_p',
				'user' => $config['user'],
				'password' => $config['pass'],
				'host' => 'enwiki.' . $config['cluster'],
				'port' => $config['port'],
				'driver' => $config['driver'],
			] );

		$this->assertInstanceOf(
			\Doctrine\DBAL\Connection::class,
			$manager->getDb( 'enwiki' )
		);

		// second call should return same connection
		$this->assertInstanceOf(
			\Doctrine\DBAL\Connection::class,
			$manager->getDb( 'enwiki' )
		);
	}
}
