upstream api {
	server localhost:8082;
	server localhost:8083;
	server localhost:8084;
	server localhost:8085;
}

server {
	
  listen 80;
  listen [::]:80;
  server_name localhost;

	location / {
		proxy_pass http://localhost:8080; 
	}

	location /api {
		proxy_pass http://api; 
	}
}
