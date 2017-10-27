# Interaction Timeline
[![Build Status](https://travis-ci.org/wikimedia/InteractionTimeline.svg?branch=master)](https://travis-ci.org/wikimedia/InteractionTimeline)

> The Interaction Timeline is a feature the Anti-Harassment Tools team is
> planning to build in late 2017. The goal of the feature is to help
> administrators understand the sequence of events between two users so
> they can confidently make a decision about how to best resolve a user conduct
> dispute.

<https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline>

## Contributing
To run the Interaction Timeline locally execute:
```
docker-compose up
```
The app should be accessible at <http://127.0.0.1:8888>.

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
[Toolfoge](https://tools.wmflabs.org) VPS only has nodejs 0.11, but 6.11 can be
run within a container.
```
webservice --backend=kubernetes nodejs shell;
cd tool;
npm install --production;
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
