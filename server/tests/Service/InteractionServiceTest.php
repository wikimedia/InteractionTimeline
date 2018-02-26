<?php

use PHPUnit\Framework\TestCase;

class InteractionServiceTest extends TestCase {

	public function setUp() {
	}

	public function xtestGetInteraction() {
		$service = $this->getMockBuilder( App\Service\InteractionService::class )
			->disableOriginalConstructor()
			->setMethods( [ 'getEditedPages' ] )
			->getMock();

		$userPages = [
			[ 'user-A', [ 1, 2, 3, 5, 6 ] ],
			[ 'user-B', [ 3, 4, 6 ] ],
		];

		$service->expects( $this->any() )
			->method( 'getEditedPages' )
			->will( $this->returnValueMap( $userPages ) );

		$users = [ 'user-A', 'user-B' ];
		$interaction = $service->getInteraction( $users, 'enwiki' );
		$this->assertEquals( [ 3,6 ], $interaction );
	}
}
