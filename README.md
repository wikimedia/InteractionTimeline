# Interaction Timeline
[![Build Status](https://travis-ci.org/wikimedia/InteractionTimeline.svg?branch=master)](https://travis-ci.org/wikimedia/InteractionTimeline)

> The Interaction Timeline is a feature the Anti-Harassment Tools team is
> planning to build in late 2017. The goal of the feature is to help
> administrators understand the sequence of events between two users so
> they can confidently make a decision about how to best resolve a user conduct
> dispute.

Project documentation: <https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline><br>
Live instance: <https://tools.wmflabs.org/interaction-timeline/>

## Contributing
*Dev access to Toolforge is required.*
_ Copy `./.env.dist` to `./.env` and customize.
- You can find `DB_USER` and `DB_PASS` in `replica.my.cnf` in your home directory after you [ssh into toolforge](https://wikitech.wikimedia.org/wiki/Help:Access#Accessing_Toolforge_instances).
- If on mac/windows, open an [ssh tunnel to toolforge](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Database#SSH_tunneling_for_local_testing_which_makes_use_of_Wiki_Replica_databases) on your machine.
- If on linux, copy your toolforge ssh private key into the project as `id_rsa` and remove the password (if necessary). This file is part of .gitignore and will not be added to the repo
```
cp /path/to/your/priv/key ./etc/ssh/id_rsa
```

- Run the Interaction Timeline locally execute:
```
docker-compose up
```
The app should be accessible at <http://127.0.0.1:8888> and <http://127.0.0.1:8888/api/hello>

## Deploy
Interaction Timeline is hosted on [Toolfoge](https://tools.wmflabs.org)
```
ssh login.tools.wmflabs.org;
become interaction-timeline;
cd tool;
```

### Pull
```
git pull origin master
```

### Build
[Toolforge](https://tools.wmflabs.org) provides Node.js 0.11 by default, but
Node.js 6.11 is available via the Kubernetes backend.
```
webservice --backend=kubernetes nodejs shell;
cd tool/client;
./bin/build;
exit;
```

### Start
```
webservice --backend=kubernetes start
```

### Stop
```
webservice --backend=kubernetes stop
```

### Restart
```
webservice --backend=kubernetes restart
```

## API Endpoints
### Interaction
```
/api/{wiki}/interaction?user={username1|username2}&start_date={timestamp}&end_date={timestamp}&limit={50}&continue={continue_string}
```
#### Parameters
* `wiki:` Wiki project we want to check the interactions on. Ex: enwiki, eswiki, testwiki
* `user:` List of usernames involved in the interactions joined by a `|`. No less than 2
* `start_date:` The start timestamp to return from
* `end_date:` The end timestamp to return to
* `limit:` Maximum amount of interactions to list. Default to 50
* `continue:` When more results are available, use the returned continue string to fetch the next page

#### Example
```
/api/testwiki/interaction?user=Test-bananas|Test-apples&start_date=1509508800&end_date=1512104400&limit=10&continue=MzM4NTEy
```
