FROM node:lts

RUN git config --global --add safe.directory /github/workspace

LABEL "com.github.actions.name"="Github Build & Deploy Action"
LABEL "com.github.actions.description"="This action will auto deploy to target branch when it get triggered"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/duetds/github-deploy-actions"
LABEL "homepage"="https://github.com/duetds/github-deploy-actions"
LABEL "maintainer"="DuetDS <duetdesignsystem@lahitapiola.fi>"

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
