import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [store, setStore] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(result => (result.Items))
      .then(items => setStore(items))

  }, []);

  const buyProduct = (product) => {
    const item = {
      id: product.id,
      title: product.title,
      price: product.price
    }

    fetch('http://localhost:5000/products', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => {

        response.ok ? (document.querySelector('#response').textContent = response.body)
          : (document.querySelector('#response').textContent = "Draft order post failed")

        console.log(response)
      }
      )
  }

  //console.log(store)

  return (

    <React.Fragment>
      <div className="container">
        <div className="row">
          {store.map(product => {
            return (product.image ? (
              <ProductWrapper key={product.id} className="col-9 mx-auto col-md-6 col-lg-3 my-3">
                <div className="card">
                  <div className="img-container p-5">
                    <img src={product.image} alt="" className="card-img-top" />
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <p className="align-self-center mb-0">{product.title}</p>
                    <h5 className="text-blue font-italic mb-0">
                      <span className="mr-1">$</span>
                      {product.price * 0.75}
                      {' '}
                      <span className="mr-1" style={{ 'text-decoration': 'line-through' }}>${product.price}</span>

                    </h5>
                    <button onClick={() => buyProduct(product)}>Order</button>
                    <div id="response"></div>
                  </div>
                </div>
              </ProductWrapper >) : (
                <br />
              )
            )
          })}
        </div>
      </div>
    </React.Fragment>

  );
}

export default App;

//! Styled Elements
const ProductWrapper = styled.div`
  .card {
    border-color: transparent;
    transition: all 1s linear;
  }
  .card-footer {
    background: transparent;
    border-top: transparent;
    transition: all 1s linear;
  }
  &:hover {
    .card {
      border: 0.04rem solid rgba(0, 0, 0, 0.2);
      box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.2);
    }
    .card-footer {
      background: rgba(247, 247, 247);
    }
  }
  .img-container {
    position: relative;
    overflow: hidden;
    
  }
  .card-img-top {
    height:200px;
    width:200px;
    transition: all 1s linear;
  }
  .img-container:hover .card-img-top {
    transform: scale(1.2);
  }
  .cart-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.2rem 0.4rem;
    background: var(--lightBlue);
    border: none;
    color: var(--mainWhite);
    font-size: 1.4rem;
    border-radius: 0.5rem 0 0 0;
    transform: translate(100%, 100%);
    transition: all 1s ease-in-out;
  }
  .img-container:hover .cart-btn {
    transform: translate(0, 0);
  }
  .cart-btn:hover {
    color: var(--mainBlue);
    cursor: pointer;
  }
`