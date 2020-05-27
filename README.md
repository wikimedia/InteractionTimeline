# Interaction Timeline
[![Build Status](https://travis-ci.org/wikimedia/InteractionTimeline.svg?branch=master)](https://travis-ci.org/wikimedia/InteractionTimeline)

> The Interaction Timeline is a feature the Anti-Harassment Tools team is
> planning to build in late 2017. The goal of the feature is to help
> administrators understand the sequence of events between two users so
> they can confidently make a decision about how to best resolve a user conduct
> dispute.

## Non-GitHub Resources

Description | Title
----------- | --------
Live instance | [Interaction Timeline][t2]
Project documentation | [Community health initiative/Interaction Timeline - Meta][t2]
Project Workboard | [InteractionTimeline · Workboard][t3]

[t1]: https://interaction-timeline.toolforge.org/
[t2]: https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline
[t3]: https://phabricator.wikimedia.org/tag/interactiontimeline/

## Contributing
*Dev access to Toolforge is required.*
* Copy `./.env.dist` to `./.env` and customize.
* You can find `DB_USER` and `DB_PASS` in `replica.my.cnf` in your home directory after you [ssh into toolforge](https://wikitech.wikimedia.org/wiki/Help:Access#Accessing_Toolforge_instances).
* Open an [ssh tunnel to toolforge](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Database#SSH_tunneling_for_local_testing_which_makes_use_of_Wiki_Replica_databases) on your machine.
  * On Linux, ensure that your tunnel is bound to `0.0.0.0` rather than just localhost:
    ```shell
    ssh -N yourusername@tools-dev.wmflabs.org -L 0.0.0.0:3306:enwiki.analytics.db.svc.eqiad.wmflabs:3306
    ```
* Run the Interaction Timeline locally:
    ```shell
    docker-compose up
    ```
The app should be accessible at <http://127.0.0.1:8888> and <http://127.0.0.1:8888/api/hello>

## Deploy
Interaction Timeline is hosted on [Toolforge](https://tools.wmflabs.org)
```shell
ssh login.toolforge.org;
become interaction-timeline;
cd tool;
```

### Pull
```shell
git pull origin master
```

### Build
[Toolforge](https://tools.wmflabs.org) provides Node.js 0.11 by default, but
Node 10 is available via the Kubernetes backend.
```shell
webservice --backend=kubernetes --mem 2Gi node10 shell;
cd tool/client;
npm ci --verbose --unsafe-perm;
npm run build;
exit;
```

### Start
```shell
webservice --canonical --backend=kubernetes php7.2 start
```

### Stop
```shell
webservice --backend=kubernetes stop
```

### Restart
```shell
webservice --canonical --backend=kubernetes restart
```

## API Endpoints
### Interaction
```
/api/{wiki}/interaction?user={username1|username2}&namespace={0|1|2}&start_date={timestamp}&end_date={timestamp}&limit={50}&continue={continue_string}
```
### Parameters
* `wiki:` Wiki project we want to check the interactions on. Ex: enwiki, eswiki, testwiki
* `user:` List of usernames involved in the interactions joined by a `|`. No less than 2
* `namespace:` List of namespace ids we want the interactions on joined by a `|`
* `start_date:` The start timestamp to return from
* `end_date:` The end timestamp to return to
* `limit:` Maximum amount of interactions to list. Default to 50
* `continue:` When more results are available, use the returned continue string to fetch the next page

### Example
```
/api/testwiki/interaction?user=Test-bananas|Test-apples&namespace=0|4|5&start_date=1509508800&end_date=1512104400&limit=10&continue=MzM4NTEy
```

## Alternatives
* [Editor Interaction Analyser](https://tools.wmflabs.org/sigma/editorinteract.py)
