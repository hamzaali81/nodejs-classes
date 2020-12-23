const fs = require('fs');
const http=require('http');
const url = require('url');
// const input = fs.readFileSync('./file.txt','utf8');
// console.log(input);

// const output = `Hey ali watsupp!! your friend name some intro ${input}`
// fs.writeFileSync('./file.txt',output);

//Async file

// fs.readFile('./file2.txt','utf-8',(err,data1)=>{
//     if(err){return console.log('Error!!');}
//     console.log(data1);
//     fs.readFile(`./${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile(`./${data2}.txt`,'utf-8',(err,data3)=>{
//             console.log('data==>',data3);
//             fs.writeFile('final.txt',`${data1}${data2}${data3}`,'utf-8',(err)=>{
//                 console.log(err);
//             })
//         })
//     })
// })

//Server
//Create Simple Server

// const server= http.createServer((req,res)=>{
// console.log(req);
//     const file = fs.readFile('./final.txt','utf-8',(err,data)=>{
    
//     res.end(data)
// })
// })

// server.listen(8000,'127.0.0.1',()=>{
//     console.log('Server listening port 8000!');
// })

//web api test
// route test
const data = fs.readFileSync('./data.json','utf-8')
const dataObj = JSON.parse(data);
const server= http.createServer((req,res)=>{
console.log(req.url);
const pathName = req.url;
if(pathName === '/' || pathName==='/home'){
    res.end('<h1>Home</h1>')

}
else if(pathName === '/product'){
    res.end('<h1>Product</h1>')
}
else if(pathName==='/api'){
    //api
    fs.readFile('./data.json','utf-8',(err,data)=>{
        // const productData = JSON.parse(data);
        // console.log(productData);
        // // console.log(data);
        // res.writeHead(200,{
        //     'Content-type': 'text/html',
        //     'my-Header': 'Ok path'

        // })
        res.end(data)
    })
}
else{
res.writeHead(404,{
    'Content-type': 'text/html',
    'my-Header': 'wrong path'

})
res.end('<h1>Page Not Found!</h1>')
}
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Server listening port 8000!');
})


























