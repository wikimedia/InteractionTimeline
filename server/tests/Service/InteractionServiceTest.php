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

		$service = new InteractionService( $revisionDao );
		list( $interaction, $continue ) = $service->getInteraction( [] );

		$this->assertEquals( 'test-continue', $continue );
		$this->assertEquals( [ $this->getSimpleInteractionResponse() ], $interaction );
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
				'rev_user_text' => 'user 1',
				'rev_timestamp' => '20180222000000',
				'rev_minor_edit' => 1,
				'sizediff' => 100,
				'rev_comment' => 'comment 1',
				'rev_deleted' => 0,
		];
	}
}
