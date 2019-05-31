<?php

use App\Service\InteractionService;
use PHPUnit\Framework\TestCase;

class InteractionServiceTest extends TestCase {

	public function testSimpleInteraction() {
		$revisionDao = $this->createMock( \App\Dao\RevisionDao::class );

		$revisionDao->expects( $this->once() )
			->method( 'getUserRevisionsInCommonPages' )
			->willReturn( [ [ 1 ], 'test-continue' ] );

		$revisionDao->expects( $this->once() )
			->method( 'getRevisionDetails' )
			->with( $this->equalto( [ 1 ] ) )
			->willReturn( [ $this->getRevisionDetails() ] );

		$userDao = $this->createMock( \App\Dao\UserDao::class );
		$userDao->expects( $this->any() )
			->method( 'getUserId' )
			->willReturn( 1 );

		$service = new InteractionService( $revisionDao, $userDao );
		$users = [ 'user-1', 'user-2' ];
		list( $interaction, $continue ) = $service->getInteraction( $users );

		$this->assertEquals( 'test-continue', $continue );
		$this->assertEquals( [ $this->getSimpleInteractionResponse() ], $interaction );
	}

	/**
	 * @dataProvider providerInvalidParams
	 */
	public function testInteractionFailsWithInvalidParams(
		$users, $startDate, $endDate, $limit, $continue
	) {
		$revisionDao = $this->createMock( \App\Dao\RevisionDao::class );
		$userDao = $this->createMock( \App\Dao\UserDao::class );

		$service = new InteractionService( $revisionDao, $userDao );

		$this->expectException( \InvalidArgumentException::class );
		$service->getInteraction( $users, $startDate, $endDate, $limit, $continue );
	}

	public function testInteractionFailsWithNoUserIdsFound() {
		$revisionDao = $this->createMock( \App\Dao\RevisionDao::class );
		$userDao = $this->createMock( \App\Dao\UserDao::class );

		$userDao->expects( $this->any() )
			->method( 'getUserId' )
			->willReturn( null );

		$service = new InteractionService( $revisionDao, $userDao );

		$this->expectException( \InvalidArgumentException::class );

		$users = [ 'user-1', 'user-2' ];
		$service->getInteraction( $users );
	}

	public function providerInvalidParams() {
		return [
			[ [ 'a', 'b' ], 'invalid-date', null, 20, null ],
			[ [ 'a', 'b' ], 1507056594, 'invalid-date', 50, null ],
			[ [ 'a', 'b' ], null, null, 'invalid-limit', null ],
			[ [], null, null, 100, null ],
		];
	}

	private function getSimpleInteractionResponse() {
		return [
			'rev_id' => 1,
			'page_id' => 1,
			'page_title' => 'title 1',
			'page_namespace' => 1,
			'user' => 'user 1',
			'timestamp' => strtotime( '20180222000000' ),
			'minor' => true,
			'size_diff' => 100,
			'comment' => 'comment 1',
			'comment_hidden' => false,
			'suppressed' => false
		];
	}
	private function getRevisionDetails() {
		return [
				'rev_id' => '1',
				'rev_page' => '1',
				'page_title' => 'title 1',
				'page_namespace' => '1',
				'actor_name' => 'user 1',
				'rev_timestamp' => '20180222000000',
				'rev_minor_edit' => 1,
				'sizediff' => 100,
				'rev_comment' => 'comment 1',
				'rev_deleted' => 0,
		];
	}
}
