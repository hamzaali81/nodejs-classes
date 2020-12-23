const fs = require('fs');
const url = require('url');
const http = require('http');
const slugify=require('slugify')

const replaceTemplate = require('./modules/replace-template');


// const replaceTemplate = (temp,product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
//     output = output.replace(/{%IMAGE%}/g,product.image)
//     output = output.replace(/{%PRICE%}/g,product.price)
//     output = output.replace(/{%FROM%}/g,product.from)
//     output = output.replace(/{%NUTRIENTS%}/g,product.nutrients)
//     output = output.replace(/{%QUANTITY%}/g,product.quantity)
//     output = output.replace(/{%DESCRIPTION%}/g,product.description)
//     output = output.replace(/{%ID%}/g,product.id)

//     if(!product.oraganic) {
//         output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//         return output
//     }
// }

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data)

console.log('dataObj',dataObj);

console.log(slugify('fresh avocados', {lower: true}));

const slugs = dataObj.map((el)=> slugify(el.productName, {lower: true}));
console.log('slugs',slugs);

const server = http.createServer((req,res)=>{
    // const pathName = req.url;

    console.log(req.url);
    console.log(url.parse(req.url,true)); 
   const { query,pathname } = url.parse(req.url,true)
    //Overview page
    if(pathname === '/' || pathname==='/overview'){
        
        res.writeHead(200,{
            'Content-type':'text/html',
            'my-header': 'Api ok'
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml) 
        // console.log(cardsHtml);
        // res.end(tempOverview)
        res.end(output)
    }
    //product page
    else if(pathname==='/product'){
        console.log(query);
        res.writeHead(200,{
            'Content-type':'text/html',
            'my-header': 'Api ok'
        })
        // res.end(tempProduct)
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
        res.end('This is product')
    }
    //api page
    else if(pathname==='/api'){
    res.writeHead(200,{
        'Content-type':'text/html',
        'my-header': 'Api ok'
    })
    res.end(data)
    }
    //Not found
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
             'my-header': 'error path'
        })
    res.end('<h1>Page not found!</h1>')
    }

})

server.listen(3000,'127.0.0.1',()=>{
    console.log('Server listen port 3000');
})