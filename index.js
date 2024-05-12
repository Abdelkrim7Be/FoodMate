// Blocking, synchronous way
// const textIn = fs.readFileSync("./starter/txt/append.txt", "utf-8");
// console.log("textIn");

// const textOut = "this is karim mp!!!";
// fs.writeFileSync("./starter/txt/Krimo.txt", textOut);
// console.log("file created and accomplished");

//Non-blocking,  synchronous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data);
// });
// console.log("will read file!!");
// RS :
// will read file!!
// read-this

// OBSERVATION :
// so Node;js <ill start reading the file start.txt in the BACKGROUND and it will not
// block the flow of code, while that , it will go tto the next block of code which
// the log of(will read file') and after finishing the reading process, it will go
// back and run the callback function

// data contains the 'contenu' of the file

// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
//     if (err) return console.log('Error! 🤷‍♂️');
//     fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2);
//         fs.readFile("./starter/txt/append.txt", "utf-8", (err, data3) => {
//             console.log(data3);
//             fs.writeFile("./starter/txt/final.txt",`${data2}\n${data3}` ,'utf-8', err => {
//                 console.log('Your file has been written successfully 😁');
//             });
//         });
//     });
// });
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
/////-------------------------------------------------------------------------------
// SERVER

// Setting up the core modules
const fs = require("fs");
const http = require("http");
const url = require("url");

// Setting up 3rd party modules
const slugify = require("slugify"); //returns a variable

// Setting the modeles coming from my file system
const replaceTemplate = require("./starter/modules/replaceTemplate");

// The functions
// const replaceTemplate = (temp, product) => {
//   // So basically here we replace the placeholder that exists in a givern template with data retrieved from the Json file
//   let output = temp.replace(/{% PRODUCTNAME %}/g, product.productName);
//   output = output.replace(/{% IMAGE %}/g, product.image);
//   output = output.replace(/{% PRICE %}/g, product.price);
//   output = output.replace(/{% ORIGINS %}/g, product.from);
//   output = output.replace(/{% NUTRIENTS %}/g, product.nutrients);
//   output = output.replace(/{% QUANTITY %}/g, product.quantity);
//   output = output.replace(/{% ID %}/g, product.id);
//   if (!product.organic) {
//     output = output.replace(/{% NOT-ORGANIC %}/g, "not-organic");
//   }

//   return output;
// };

//So here we put the code of reading the file Synchronously so we don't care whether if  it's blocking the process, that's why we put it first ,
// So the trick here is to IDENTIFY which code to put first an which code gonna get run  over and over again

// These 3 decalarations could not be written inside the callback function of server
// because the callback function get triggered whenever there is a request, so
// imagine
// if there is a million request then we will block the code 1 million times once of
// each these declarations HHHHHHHHHHHH
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);

// Parsing the JSON file content as a table of objects
const dataObject = JSON.parse(data);

// Creating an array containing all the slugs
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// 1. Creating the server  (to close the serveur : ctrl + C)
const server = http.createServer((req, res) => {
  // The request path

  //   console.log(req.url);
  //   console.log(url.parse(req.url, true));
  //   /product?id=0
  // Url {
  //   protocol: null,
  //   slashes: null,
  //   auth: null,
  //   host: null,
  //   port: null,
  //   hostname: null,
  //   hash: null,
  //   search: '?id=0',
  //   query: [Object: null prototype] { id: '0' },
  //   pathname: '/product',
  //   path: '/product?id=0',
  //   href: '/product?id=0'
  // }

  const { query, pathname } = url.parse(req.url, true);

  ////
  // Routing process
  // ------------------------The overiew Page-------------------
  // the overview page process
  if (pathname === "/" || pathname === "/overview") {
    // 1.1 we se the content type which is HTML here
    res.writeHead(200, { "Content-type": "text/html" });

    // 1.2 the manipulation

    // we create the cards that we gonna put in the page
    const cardsHTML = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    // we replace the placeholder with cards correspondantes
    const output = tempOverview.replace("{% PRODUCT_CARDS %}", cardsHTML);

    // 1.3 Sending the output as a result
    res.end(output);

    // ---------------------The product page--------------------
  } else if (pathname === "/product") {
    // console.log(query); //[Object: null prototype] { id: '0' }

    // 1.1 we se the content type which is HTML here
    res.writeHead(200, { "Content-type": "text/html" });

    // 2.2 we retrieve the correspondant product from json data
    const product = dataObject[query.id]; //route to the product with the ID
    // mentionned in the url
    const output = replaceTemplate(tempProduct, product);

    // 2.3 Sending the output as a result
    res.end(output);

    // The API
  } else if (pathname === "/api") {
    // to read from the API file and parse it into the browser
    // fs.readFile(
    //   `${__dirname}/starter/dev-data/data.json`,
    //   "utf-8",
    //   (err, data) => {
    //     const productData = JSON.parse(data);
    //     res.writeHead(200, { "Content-type": "application/json" });
    //     // console.log(productData);
    //     res.end(data);
    //   }
    // );
    res.writeHead(200, { "Content-type": "application/json" });

    res.end(data);
    // The code of the callack function has access to the code of the scope chaine

    // NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>Page not found</h1>");
  }
});
// the calback function will get triggered whenver ther is a request hitting the server

// 2. Listenning to the incoming requests
// a port is sub-adress on a specified host
// The callback function will strat running as sooon as the server starts running
server.listen(8000, "127.0.0.1", () => {
  console.log("listenning to requests on port 8000");
});
