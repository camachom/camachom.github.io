FROM klakegg/hugo:0.101.0-onbuild AS hugo

FROM nginx:alpine
USER nginx
COPY --from=hugo /target /usr/share/nginx/html