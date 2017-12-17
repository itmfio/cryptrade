


````
docker run -v "$PWD":/var/task --name cryptrade lambci/lambda:nodejs6.10

````

````
docker run -it -v "$PWD":/var/task lambci/lambda:build-nodejs6.10 bash
````

````
npm install -g babel-cli node-lambda
````
