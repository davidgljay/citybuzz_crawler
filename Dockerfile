FROM node
MAINTAINER "David Jay <davidgljay@gmail.com>"
LABEL updated_at = "2015-10-11" version = .01
LABEL description = "A crawler for scanning city mayor's offices websites and sites about city policy for analysis."
RUN apt-get update
COPY ./ /home/citybuzz
WORKDIR /home/citybuzz
ENV PUBSUB_PROJECT_ID='climatescrape-1019'
ENV PUBSUB_KEYFILE='climatescrape_key.json'
ENV PAPERTRAIL_HOST='logs3.papertrailapp.com'
ENV PAPERTRAIL_PORT='53932'
RUN npm install
CMD node app

