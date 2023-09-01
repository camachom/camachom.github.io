FROM klakegg/hugo:onbuild AS hugo

FROM nginx:alpine
COPY --from=hugo  /target /usr/share/nginx/html