FROM klakegg/hugo:0.101.0-onbuild AS hugo

FROM nginx:alpine
COPY --from=hugo /target /usr/share/nginx/html