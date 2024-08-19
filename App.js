import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';

const API_URL = 'https://fakestoreapi.com/products';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 Ecommerce Store</Text>
    </View>
  );
};

const Header = () => {
  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isConfirmOrderVisible, setIsConfirmOrderVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setOriginalProducts(data); 
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const toggleSignupModal = () => {
    setIsSignupModalVisible(!isSignupModalVisible);
  };

  const toggleLoginModal = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  };

  const handleSignup = () => {
    if (!signupEmail || !signupPassword) {
      Alert.alert('Error', 'Please enter a valid email and password');
      return;
    }

    const newUser = {
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPassword,
    };

    setUsers([...users, newUser]);
    setIsSignupModalVisible(false);
    Alert.alert('Success', 'You have successfully signed up!');
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Please enter a valid email and password');
      return;
    }

    const user = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );

    if (user) {
      setLoggedInUser(user);
      setIsLoginModalVisible(false);
      Alert.alert('Success', 'You are logged in successfully!');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    Alert.alert('Success', 'Item added to cart!');
  };

  const clearCart = () => {
    setCartItems([]);
    Alert.alert('Success', 'Cart cleared!');
  };

  const handleSearch = () => {
    const searchResults = originalProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(searchResults);
    if (searchResults.length === 0) {
      Alert.alert('No Products Found', 'These products are not available');
    }
  };

  const handleOrderConfirmation = () => {
    if (!loggedInUser) {
      Alert.alert('Error', 'You must be logged in to place an order');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setIsConfirmOrderVisible(true);
  };

  const confirmOrder = () => {
    setIsConfirmOrderVisible(false);
    setCartItems([]);
    Alert.alert('Success', 'Your order has been placed!');
  };

  const renderProducts = () => {
    return products.map((product) => (
      <View key={product.id} style={styles.productItem}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Text>{product.title}</Text>
        <Text>${product.price}</Text>
        <Button title="Add to Cart" onPress={() => addToCart(product)} />
      </View>
    ));
  };

  const resetProducts = () => {
    setProducts(originalProducts);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Ecommerce Store</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={resetProducts}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={toggleSignupModal}>
            <Text style={styles.navButtonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={toggleLoginModal}>
            <Text style={styles.navButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => setShowCartModal(true)}>
            <Text style={styles.navButtonText}>Cart ({cartItems.length})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderProducts()}
      </ScrollView>

      <Footer />

      <Modal visible={isSignupModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={signupName}
            onChangeText={setSignupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={signupEmail}
            onChangeText={setSignupEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={signupPhone}
            onChangeText={setSignupPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={signupPassword}
            onChangeText={setSignupPassword}
          />
          <Button title="Sign Up" onPress={handleSignup} />
          <Button title="Cancel" onPress={toggleSignupModal} />
        </View>
      </Modal>

      <Modal visible={isLoginModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={loginEmail}
            onChangeText={setLoginEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
          <Button title="Login" onPress={handleLogin} />
          <Button title="Cancel" onPress={toggleLoginModal} />
        </View>
      </Modal>

      <Modal visible={showCartModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cart</Text>
          {cartItems.length === 0 ? (
            <Text>Your cart is empty.</Text>
          ) : (
            cartItems.map((item, index) => (
              <View key={index} style={styles.cartItem}>
                <Text>{item.title}</Text>
                <Text>${item.price}</Text>
              </View>
            ))
          )}
          <View>
            <Text>Select Payment Method:</Text>
            <TouchableOpacity onPress={() => setSelectedPaymentMethod('Credit Card')}>
              <Text style={styles.paymentOption}>
                {selectedPaymentMethod === 'Credit Card' ? '●' : '○'} Credit Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedPaymentMethod('PayPal')}>
              <Text style={styles.paymentOption}>
                {selectedPaymentMethod === 'PayPal' ? '●' : '○'} PayPal
              </Text>
            </TouchableOpacity>
          </View>
          <Button title="Confirm Order" onPress={handleOrderConfirmation} />
          <Button title="Clear Cart" onPress={clearCart} />
          <Button title="Close" onPress={() => setShowCartModal(false)} />
        </View>
      </Modal>

      <Modal visible={isConfirmOrderVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Order</Text>
          <Text>Name: {loggedInUser?.name}</Text>
          <Text>Email: {loggedInUser?.email}</Text>
          <Text>Phone: {loggedInUser?.phone}</Text>
          <Text>Payment Method: {selectedPaymentMethod}</Text>
          <Button title="Confirm" onPress={confirmOrder} />
          <Button title="Cancel" onPress={() => setIsConfirmOrderVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#29a9ff',
    padding: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logo: {
   fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  navButtons: {
      flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#3700B3',
    borderRadius: 5,
  },
  navButtonText: {
     color: '#FFFFFF',
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  productItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  paymentOption: {
    fontSize: 16,
    marginVertical: 5,
  },
  footer: {
    backgroundColor: '#29a9ff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Header;
