FROM docker.io/debian:13 AS build
WORKDIR /root

RUN apt-get update && \
    apt-get install npm -y

COPY . .
    
RUN npm install vitepress && \
    npm run docs:build

FROM docker.io/httpd:latest
COPY --from=build /root/docs/.vitepress/dist /usr/local/apache2/htdocs
