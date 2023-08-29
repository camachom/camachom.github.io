FROM klakegg/hugo:0.101.0-onbuild AS hugo

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=hugo  /target /usr/share/nginx/html
RUN ls -l /usr/share/nginx/html