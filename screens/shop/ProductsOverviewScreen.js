import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Button, Platform, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    try {
      setRefreshing(true)
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message)
    }
    setRefreshing(false)
  })

  useEffect(()=>{
    setLoading(true)
    loadProducts().then(()=>{
      setLoading(false)
    });
    return ()=>{
      setError('')
    }
  },[]);

  useEffect(()=>{
    const subscription = props.navigation.addListener('willFocus', loadProducts);

    return ()=>{
      subscription.remove();
    }
  },[])


  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  if(error){
    return <View style={styles.loading}>
      <Text style={styles.msg}>Oops, looks like an error occured!</Text>
      <Button title="Try Again" onPress={loadProducts}/>
    </View>
  }

  if(loading){
    return <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  }

  if(!loading && products.length===0){
    return <View style={styles.loading}>
      <Text style={styles.msg}>No products found, consider adding some?</Text>
    </View>
  }

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={loadProducts}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  loading:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})

export default ProductsOverviewScreen;