import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import ShowWrapper from './show_wrapper';

const ShowWrapperExample = () => {
  // Dummy data for products
  const dummyProducts = [
    { id: 1, name: 'Ibuprofen', price: 8.99, stock: 120 },
    { id: 2, name: 'Aspirin', price: 6.49, stock: 85 },
    { id: 3, name: 'Acetaminophen', price: 7.25, stock: 200 },
    { id: 4, name: 'Multivitamin', price: 12.99, stock: 65 },
    { id: 5, name: 'Allergy Relief', price: 15.75, stock: 42 },
  ];

  // State to control different scenarios
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: dummyProducts,
  });

  // Simulate API states
  const simulateLoading = () => {
    setState({ isLoading: true, isError: false, isSuccess: false, data: [] });
    setTimeout(() => {
      setState({ isLoading: false, isError: false, isSuccess: true, data: dummyProducts });
    }, 2000);
  };

  const simulateError = () => {
    setState({ isLoading: false, isError: true, isSuccess: false, data: [] });
  };

  const simulateEmpty = () => {
    setState({ isLoading: false, isError: false, isSuccess: true, data: [] });
  };

  const simulateSuccess = () => {
    setState({ isLoading: false, isError: false, isSuccess: true, data: dummyProducts });
  };

  // Render product item
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productStock}>In stock: {item.stock}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="Load Data" onPress={simulateSuccess} />
        <Button title="Loading" onPress={simulateLoading} />
        <Button title="Error" onPress={simulateError} />
        <Button title="Empty" onPress={simulateEmpty} />
      </View>
      
      <ShowWrapper
        isError={state.isError}
        error={{ error: "Failed to fetch products from the server" }}
        refetch={simulateSuccess}
        isFetching={state.isLoading}
        dataLength={state.data.length}
        isSuccess={state.isSuccess}
        type="list"
        emptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No medications found</Text>
            <Text style={styles.emptyStateSubText}>Try adjusting your search criteria</Text>
          </View>
        }
      >
        <FlatList
          data={state.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </ShowWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2c3e50',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 15,
    color: '#3498db',
    fontWeight: '500',
  },
  productStock: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default ShowWrapperExample;