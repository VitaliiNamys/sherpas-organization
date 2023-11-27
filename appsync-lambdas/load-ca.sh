#!/bin/bash

curl -O https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem
mv us-east-1-bundle.pem src/functions/get-soid-by-webhook-id/
