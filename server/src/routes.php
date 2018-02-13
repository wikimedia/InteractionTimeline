<?php

$app->get( '/hello', App\Action\HelloAction::class )
	->setName( 'hello' );
