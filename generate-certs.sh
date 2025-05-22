#!/bin/bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl-certs/key.pem \
  -out ssl-certs/cert.pem \
  -subj "/C=ES/ST=State/L=City/O=Organization/CN=localhost"
