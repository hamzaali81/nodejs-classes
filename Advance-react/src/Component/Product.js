import React from 'react';
import { Link,useRouteMatch } from 'react-router-dom';
import Shoes from  './../Data/shoes.json';
console.log(Shoes);
function Product() {
    let { path, url } = useRouteMatch();
    // console.log('path,url***',path,url);
    return (
        <div>
            <h1>Welcome to Product</h1>
            <div className="productContainer">
                {Object.keys(Shoes).map(keyName=>{
                    const shoe = Shoes[keyName];
                    console.log('keyName',keyName);
                    console.log('shoe',shoe);
                    return (
                        <Link key={keyName} 
                            className="link" 
                            to={`/product/${keyName}`}>
                                <h4>{shoe.name}</h4>
                                <img src={shoe.img} height={150} alt="shoe" />
                    </Link>)
                })}
            </div>
        </div>
    );
}

export default Product;