# CurrencyExchanger
Obtains the currency exchanges from ecb site and stores all possible currency exchanges into mongo.

Steps to use:
1)Checkout the repo
2)docker-compose up


api: http://localhost:8080/api/v1/currency/compute

Response to this api will be the original data published by ecb

While the node service is running and mutilple api calls made will only store the currency exchanges once to the db.
This may duplicate is cases where the timezone is not considered.
