import DisplayError from '../component/common/display_error';
import HandleResponse from '../component/common/handle_response';
import TextField from '../component/common/text_field';
import FeedHeader from '../component/feed_header';
import Search from '../component/search';
import LoginScreen from './(auth)/login';

import { Button, LoginBtn, SubmitModalBtn } from '../component/common/button';

import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Categories from '../component/categories';
import FeedSectionContainer from '../component/common/feed_section_container';
import ShowWrapper from '../component/common/show_wrapper';
import EmptyCustomList from '../component/emptylist/empty_custom_list';
import BigLoading from '../component/loading/big_loading';
import BigLogoLoading from '../component/loading/big_logo_loading';
import Loading from '../component/loading/loading';
import LogoLoading from '../component/loading/logo_loading';

import AddToCartOperation from '../component/cart/add_to_cart_operation';
import CartButtons from '../component/cart/cart_buttons';
import ShowWrapperExample from '../component/common/show_wrapper_example';
import PharmacyImageSlider from '../component/sliders/slider';

const LoadScreen = () => {
    const { control, handleSubmit } = useForm();

// Dummy data for prescriptions
const todayPrescriptions = [
  {
    id: '1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    patient: 'John Smith',
    status: 'Ready for pickup',
    time: '9:00 AM'
  },
  {
    id: '2',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'At bedtime',
    patient: 'Sarah Johnson',
    status: 'In progress',
    time: '11:30 AM'
  },
  {
    id: '3',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    patient: 'Michael Brown',
    status: 'Ready for pickup',
    time: '2:15 PM'
  }
];

// Simple PrescriptionList component
const PrescriptionList = ({ data }) => (
  <View style={{ padding: 10 }}>
    {data.map((item) => (
      <View key={item.id} style={{ 
        padding: 15, 
        marginBottom: 10, 
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: item.status === 'Ready for pickup' ? '#10b981' : '#f59e0b'
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1e293b' }}>
          {item.medication} <Text style={{ fontSize: 14 }}>({item.dosage})</Text>
        </Text>
        <Text style={{ color: '#64748b', marginTop: 4 }}>For: {item.patient}</Text>
        <Text style={{ color: '#64748b' }}>Schedule: {item.frequency}</Text>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginTop: 8
        }}>
          <Text style={{ 
            color: item.status === 'Ready for pickup' ? '#10b981' : '#f59e0b',
            fontWeight: '500'
          }}>
            {item.status}
          </Text>
          <Text style={{ color: '#94a3b8' }}>{item.time}</Text>
        </View>
      </View>
    ))}
  </View>
);

const router = useRouter();

const pharmacyCategories = [
  {
    _id: "cat1",
    slug: "surgical-items",
    name: "Surgical & Medical",
    color: "#4E9FDC", // Blue for medical
    image: "surgical.png"
  },
  {
    _id: "cat2",
    slug: "medicines",
    name: "Medicines",
    image: "medicine.png",
    color: "#E74C3C" // Red for medicines
  },
  {
    _id: "cat3",
    slug: "household-hygiene",
    name: "Home & Hygiene",
    image: "household.png",
    color: "#2ECC71" // Green for hygiene
  },
  {
    _id: "cat4",
    slug: "baby-care",
    name: "Baby Care",
    image: "baby.jpg",
    color: "#F39C12" // Orange for baby
  },
  {
    _id: "cat5",
    slug: "wellness",
    name: "Wellness",
    image: "wellness.jpg",
    color: "#9B59B6" // Purple for wellness
  }
];

const mockProduct = {
  _id: 'prod_123',
  title: 'Paracetamol 500mg',
  price: 5.99,
  discount: 0.50,
  inStock: 100,
  sold: 42,
  images: [
    'https://img.freepik.com/free-photo/medicine-capsules-global-health-with-geometric-pattern-digital-remix_53876-126742.jpg'
  ],
  description: 'Effective pain relief and fever reducer',
  category: 'Pain Relief',
  dosage: 'Take 1-2 tablets every 4-6 hours as needed',
  manufacturer: 'PharmaCorp'
};



  
    return (
      <ScrollView> 

<AddToCartOperation product={mockProduct} />
        
        {/* Rounded Login Button */}
        <LoginBtn 
          style={{ marginTop: verticalScale(20) }}
          isLoading={false}
          onPress={() => console.log('Login pressed')}
        >
          <Text>Pharmacy Login</Text>
        </LoginBtn>

        {/* Modal Submit Button */}
        <SubmitModalBtn
          style={{ 
            backgroundColor: '#4CAF50',
            marginTop: verticalScale(20)
          }}
          onPress={() => console.log('Submit pressed')}
        >
          <Text>Confirm Order</Text>
        </SubmitModalBtn>

        {/* Small Pill-shaped Button */}
        <Button isLoading={false}
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

        <LoginScreen />
        <Search />
        <FeedHeader title="Welcome to Our Pharmacy" />


        <Loading />
        <BigLoading />
        {/* <PageLoading/> */}
        <Text>Loading...</Text>

        <BigLogoLoading/>

        <LogoLoading/>

        <EmptyCustomList/>

        <ShowWrapper/>

        <FeedSectionContainer 
        title="Today's Prescriptions"
        showMore={true}
        onJumptoMore={() => router.navigate('Prescriptions')}
      >
        <PrescriptionList data={todayPrescriptions} />
      </FeedSectionContainer>

      {/* Additional sections example */}
      <FeedSectionContainer
        title="Low Stock Alerts"
        showMore={true}
        onJumptoMore={() => router.navigate('Inventory')}
      >
        {/* You could add another component here for low stock items */}
      </FeedSectionContainer>


      <Categories categories={pharmacyCategories} />

      <PharmacyImageSlider />

      <CartButtons />

      <AddToCartOperation product={mockProduct} />

      <Button
        onPress={() => router.push('/')}
        style={{
          backgroundColor: '#007BFF',
          padding: moderateScale(10),
          borderRadius: moderateScale(5),
          marginTop: verticalScale(20),
        }}>Go to home</Button>

        <ShowWrapperExample/>



      </ScrollView>
    )
  }

const Test = () => {
  return (
    <>
      <View><Text>Hello world</Text></View>
      <LoadScreen />
    </>
  )
}

export default Test