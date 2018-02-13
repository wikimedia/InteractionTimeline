<?php

use PHPUnit\Framework\TestCase;
use App\Dao\AbstractDao;
use Psr\Log\NullLogger;

class AbstractDaoTest extends TestCase {

	public function testGetDb() {
		$pdo = $this->createMock( \PDO::class );
		$dsn = 'mysql:host=enwiki.test-cluster;dbname=enwiki_p;port=4711';
		$config = [
			'cluster' => 'test-cluster',
			'user' => 'test-user',
			'pass' => 'test-pass',
			'port' => 4711 ,
		];

		$stub = $this->getMockBuilder( AbstractDao::class )
			->setMethods( [ 'connect' ] )
			->setConstructorArgs( [ $config, new NullLogger() ] )
			->getMock();

		$stub->expects( $this->once() )
			->method( 'connect' )
			->with( $dsn )
			->willReturn( $pdo );

		$this->assertInstanceOf(
			\PDO::class,
			$stub->getDb( 'enwiki' )
		);

		// should return the same pdo for enwiki
		$this->assertInstanceOf(
			\PDO::class,
			$stub->getDb( 'enwiki' )
		);
	}
}
