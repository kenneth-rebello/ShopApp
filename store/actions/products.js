import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => async (dispatch, getState) => {

  try {

    const userId = getState().auth.userId
    const res = await fetch('https://native-shopapp-f4694.firebaseio.com/products.json');

    if(!res.ok){
      const data = await res.json()
      console.log(data)
      throw new Error('Something went wrong')
    }

    const products = await res.json();
    const toLoad = [];
    for (let key in products){
      toLoad.push(new Product(
        key,
        products[key].ownerId, 
        products[key].title, 
        products[key].imageUrl, 
        products[key].description,
        products[key].price
      ))
    }
  
    dispatch({
      type: SET_PRODUCTS,
      toLoad: toLoad,
      userProducts: toLoad.filter(prod => prod.ownerId === userId)
    })

  } catch (err) {
    console.log(err)
    throw err
  }
}

export const deleteProduct = productId => async (dispatch, getState) => {
  const token = getState().auth.token
  await fetch(`https://native-shopapp-f4694.firebaseio.com/products/${productId}.json?auth=${token}`, {
    method: 'DELETE'
  });
  dispatch({ type: DELETE_PRODUCT, pid: productId });
};

export const createProduct = (title, description, imageUrl, price) => async (dispatch, getState) => {

  try {
    const token = getState().auth.token
    const userId = getState().auth.userId
    await fetch(`https://native-shopapp-f4694.firebaseio.com/products.json?auth=${token}`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      })
    });
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  } catch (err) {
    throw err
  }
};

export const updateProduct = (id, title, description, imageUrl) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token
    const res  = await fetch(`https://native-shopapp-f4694.firebaseio.com/products/${id}.json?auth=${token}`, {
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
