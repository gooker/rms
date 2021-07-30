FROM 172.31.2.100:5000/nginx_tzdata:alpine

# replace source
#RUN sh -c "sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories"

# set timezone
#RUN sh -c 'apk add -U tzdata'
RUN sh -c 'cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime'


WORKDIR /usr/share/nginx/html
COPY dist .

