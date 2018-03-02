<?php

$app->add( new App\Middleware\ConnectionManagerMiddleware(
	$app->getContainer()->get( 'connectionService' )
) );
