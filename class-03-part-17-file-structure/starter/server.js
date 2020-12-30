const app = require('./app');
//4)Server
const port = 3000;
app.listen(port,()=>{
console.log(`Server start port ${port}`);
})