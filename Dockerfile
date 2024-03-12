FROM docker.io/httpd:latest
COPY site/ /usr/local/apache2/htdocs/
