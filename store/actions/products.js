import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => async dispatch => {

  try {

    const res = await fetch('https://native-shopapp-f4694.firebaseio.com/products.json');

    if(!res.ok){
      throw new Error('Something went wrong')
    }

    const products = await res.json();
    const toLoad = [];
    for (let key in products){
      toLoad.push(new Product(
        key,
        'u1', 
        products[key].title, 
        products[key].imageUrl, 
        products[key].description,
        products[key].price
      ))
    }
  
    dispatch({type: SET_PRODUCTS, toLoad: toLoad})

  } catch (err) {
    console.log(err)
    throw err
  }
}

export const deleteProduct = productId => async dispatch => {
  await fetch(`https://native-shopapp-f4694.firebaseio.com/products/${productId}.json`, {
    method: 'DELETE'
  });
  dispatch({ type: DELETE_PRODUCT, pid: productId });
};

export const createProduct = (title, description, imageUrl, price) => async dispatch => {

  try {
    const response = await fetch('https://native-shopapp-f4694.firebaseio.com/products.json', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        title,
        description,
        imageUrl,
        price
      }
    });
  } catch (err) {
    throw err
  }
};

export const updateProduct = (id, title, description, imageUrl) => async dispatch => {
  try {
    console.log(title)
    const res  = await fetch(`https://native-shopapp-f4694.firebaseio.com/products/${id}.json`, {
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl
      })
    });
    const data = await res.json();
    console.log(data)
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      }
    });  
  } catch (err) {
    throw err
  } 
};
