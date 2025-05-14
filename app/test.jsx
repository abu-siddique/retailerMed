import DisplayError from '../component/common/display_error';
import HandleResponse from '../component/common/handle_response';
import TextField from '../component/common/text_field';
import LoginScreen from './(auth)/login';



import ResponsiveImage from '../component/common/resonsive_image';
import Skeleton from '../component/common/skeleton';
import EmptyOrdersList from '../component/emptylist/empty_order_list';
import FeedHeader from '../component/feed_header';
import DiscountProduct from '../component/product/discount_product';
import OutOfStock from '../component/product/out_of_stock';
import ProductCard from '../component/product/product_card';
import ProductPrice from '../component/product/product_price';
import StockIndicator from '../component/product/stock_indicator';
import SigninPromoRenderer from '../component/render/sign-in-promo-render';
import Search from '../component/search';
import ProductSkeleton from '../component/skeleton/product_skeleton';
import SubstituteSkeleton from '../component/skeleton/substitute_skeleton';



import { Button, LoginBtn, SubmitModalBtn } from '../component/common/button';

import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const LoadScreen = () => {
    const { control, handleSubmit } = useForm();
  
    return (
  
      <ScrollView> 
      
      
      <DiscountProduct discount = {80} />
      <OutOfStock />
      <Skeleton />
      <ProductSkeleton/>
      <SubstituteSkeleton />
      <ProductPrice price={1499} discount={20} />
  
      <ProductPrice  price={1499} discount={20} inStock={5} />
      <StockIndicator/>
  
      <ResponsiveImage 
        source={{ uri: 'https://example.com/image.jpg' }}
        alt="Description of image"
        containerStyle={{ width: 200, height: 200, borderRadius: 10 }}
        imageStyle={{ borderRadius: 10 }}
      />
  
   <ProductCard 
    product={{
      _id: 'med123',
      name: 'Paracetamol 500mg Tablets',
      images: [
        { url: 'paracetamol-front.jpg' },
        { url: 'paracetamol-pack.jpg' }
      ],
      quantity: {
        value: 10,
        unit: 'tablets',
        package: 'strip'
      },
      price: 5.99,
      discount: 10,
      inStock: 150,
      purchases: 12500,
      dosageForm: 'Tablets',
      manufacturer: 'ABC Pharmaceuticals'
    }}
  />
  
  <SigninPromoRenderer />
  <EmptyOrdersList />
  {/* Regular Button */}
  <Button onPress={() => console.log('Pressed')}>
        Search Medicines
      </Button>

      {/* Rounded Login Button */}
      <LoginBtn 
        style={{ marginTop: verticalScale(20) }}
        isLoading={false}
        onPress={() => console.log('Login pressed')}
      >
        Pharmacy Login
      </LoginBtn>

      {/* Modal Submit Button */}
      <SubmitModalBtn
        style={{ 
          backgroundColor: '#4CAF50',
          marginTop: verticalScale(20)
        }}
        onPress={() => console.log('Submit pressed')}
      >
        Confirm Order
      </SubmitModalBtn>

      {/* Small Pill-shaped Button */}
      <Button
        style={{
          minWidth: moderateScale(100),
          paddingVertical: verticalScale(8),
          borderRadius: moderateScale(20),
          marginTop: verticalScale(20),
        }}
        onPress={() => console.log('Small button pressed')}
      >
        <Text style={{ fontSize: moderateScale(14) }}>Add to Cart</Text>
      </Button>
      
      <View>
  <TextInput 
    placeholder="Patient Name"
    // ... other props
  />
  <DisplayError errors={{ message: "Email is required" }} style={{ marginBottom: verticalScale(8) }} />
</View>




    <View style={{ padding: moderateScale(20) }}>
      <TextField
        name="email"
        control={control}
        label="Email Address"
        placeholder="Enter your email"
        errors={{ message: "Email is required" }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextField
        name="age"
        control={control}
        label="Age"
        placeholder="Enter your age"
        type="number"
        errors={{ message: "Age is required" }}
        keyboardType="numeric"
      />
    </View>

    <HandleResponse
  isSuccess={true} // Simulate successful form submission
  isError={false} // No error in this case
  error="" // Empty since no error
  message="Prescription submitted successfully"
/>

<LoginScreen/>

<Search />

<FeedHeader
  title="Welcome to Our Pharmacy"/>










      
      </ScrollView>
    )
  }

const Test = () => {
  return (
   <LoadScreen/>
  )
}

export default Test