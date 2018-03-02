<?php

$app->group( '/{project}', function (){
	$this->get( '/interaction', App\Action\InteractionAction::class )
		->setName( 'interaction' );
} );
