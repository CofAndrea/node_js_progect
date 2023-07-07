# Node.js Project
# REST API
## Description.

A basic example of a possible structure for a ecommerce backend:
1. 3 models: Utente, Ordine, Prodotto
2. CRUD functionality for each model
3. Users created with a jsonwebtoken attached for authorizations
4. Function placed as an example for payment inside prodottoController.js
5. Custom error handling with correct codes

## Getting Started

1. download zip and extract
2. open in editor and run "npm install" in terminal to install dependencies 
3. create .env file and set values for MONGO_URI, JWT_SECRET, JWT_LIFETIME
4. run "npm start" for starting a local host(currently using nodemon package)
5. try it out: set up postman for testing( if you want to try and create an order in postman you need to write in json format in the body section following this structure {"items":[{"product":"productId", "amount":Number}, {repeat for any number of products}], "tax":Number, "shippingFee":Number} )
```
 cd my-directory
 npm install
 npm start
```

Andrea Coffetti.

[https://twitter.com/andrea_coffetti](https://twitter.com/andrea_coffetti).
[https://github.com/CofAndrea](https://github.com/CofAndrea).

Version History.
0.1.
Initial Release.