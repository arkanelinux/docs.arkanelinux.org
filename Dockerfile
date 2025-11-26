FROM docker.io/httpd:latest
COPY docs/.vitepress/dist /usr/local/apache2/htdocs
