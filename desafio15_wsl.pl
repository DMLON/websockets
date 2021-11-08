upstream api {
	server 172.20.84.197:8082;
	server 172.20.84.197:8083;
	server 172.20.84.197:8084;
	server 172.20.84.197:8085;
}

server {
	
  listen 80;
  listen [::]:80;
  server_name 172.20.84.197;

	location / {
		proxy_pass http://172.20.84.197:8080; 
	}

	location /api {
		proxy_pass http://api; 
	}
}
