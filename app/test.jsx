import { StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
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
import { verticalScale } from 'react-native-size-matters';
import Categories from '../component/categories';
import FeedSectionContainer from '../component/common/feed_section_container';
import ShowWrapper from '../component/common/show_wrapper';
import EmptyCustomList from '../component/emptylist/empty_custom_list';
import BigLoading from '../component/loading/big_loading';
import BigLogoLoading from '../component/loading/big_logo_loading';
import Loading from '../component/loading/loading';
import LogoLoading from '../component/loading/logo_loading';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import AddToCartOperation from '../component/cart/add_to_cart_operation';
import CartInfo from '../component/cart/cart_info';
import DiscountCartItem from '../component/cart/discount_cart_item';
import HorizontalProductCarousel from '../component/common/horizontal_product_carousel';
import ResponsiveImage from '../component/common/resonsive_image';
import ShowWrapperExample from '../component/common/show_wrapper_example';
import EmptySearchList from '../component/emptylist/empty_search_list';
import FreeShipping from '../component/FreeShipping';
import Description from '../component/product/description';
import ImageGallery from '../component/product/image_gallary';
import Info from '../component/product/info';
import ProductCard from '../component/product/product_card';
import ProductPrice from '../component/product/product_price';
import SigninPromoRenderer from '../component/render/sign-in-promo-render';
import PharmacyImageSlider from '../component/sliders/slider';
import CartScreen from './(main)/cart';

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

// Test button component
const TestFetch = () => {
  const [result, setResult] = useState('');
  const [responseType, setResponseType] = useState('');
  
  const testConnection = async () => {
    try {
      setResult('Testing...');
      
      // Use your ngrok URL and ensure the path is correct
      const response = await fetch('https://0938-149-111-30-128.ngrok-free.app/api/category', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      // Get the Content-Type header to check response format
      const contentType = response.headers.get('content-type') || '';
      setResponseType(`Content-Type: ${contentType}`);
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Handle different response types
      if (contentType.includes('application/json')) {
        const data = await response.json();
        setResult(`Success (JSON): ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        // For HTML or other non-JSON responses
        const text = await response.text();
        setResult(`Received non-JSON response (first 100 chars): ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log('Error details:', error);
      setResult(`Error: ${error.message || error}`);
    }
  };
  
  return (
    <View style={{ marginVertical: 20, padding: 10 }}>
      <Button title="Test API Connection" onPress={testConnection}>Test API</Button>
      <Text style={{ marginTop: 10, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
        {result}
      </Text>
      {responseType ? (
        <Text style={{ marginTop: 5, color: '#666' }}>{responseType}</Text>
      ) : null}
      
      <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Troubleshooting Tips:</Text>
      <Text>1. Check if the URL path is correct (/api/categories)</Text>
      <Text>2. Verify the server is returning JSON responses</Text>
      <Text>3. Check CORS configuration on the server</Text>
    </View>
  );
};

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
const mockProduct1 = {
  _id: '1',
  name: 'Paracetamol 500mg Tablets',
  title: 'Paracetamol 500mg Tablets',
  price: 199.99,
  ptr: 150.50,
  mrp: 220.00,
  buy: 3,
  get: 1,
  gst: 12,
  discount: 10,
  inStock: 250,
  sold: 1200,
  quantity: {
    value: 16,
    unit: 'tablets',
    package: 'box'
  },
  dosageForm: 'Tablet',
  manufacturer: 'HealthCare Pharma',
  purchases: 1250,
  images: [
    {
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop',
      _id: '1-1'
    },
    {
      url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400&auto=format&fit=crop',
      _id: '1-2'
    }
  ],
  product_info : `<div>
  <h1>Dolo 650 Tablet</h1>

  <p><strong>NPPA Regulated</strong><br>
  <strong>Marketer</strong>: Micro Labs Ltd</p>

  <h2>Salt Composition</h2>
  <ul>
    <li><strong>Active Ingredient</strong>: Paracetamol (650mg)</li>
    <li><strong>Salt Synonyms</strong>: Acetaminophen</li>
  </ul>

  <h2>Storage</h2>
  <p>Store below 25°C</p>

  <h2>Product Introduction</h2>
  <p>Dolo 650 Tablet helps relieve pain and fever by blocking chemical messengers. Used for:</p>
  <ul>
    <li>Headaches, migraine</li>
    <li>Toothaches, sore throat</li>
    <li>Period pains, arthritis</li>
    <li>Common cold</li>
  </ul>
  <p><strong>COVID-19 Note</strong>: Widely prescribed during the pandemic.</p>

  <h2>Dosage</h2>
  <ul>
    <li>Take with food (max 4 doses/24 hours, ≥4 hour gaps)</li>
    <li>Swallow whole; do not crush/chew</li>
  </ul>

  <h2>Uses</h2>
  <ul>
    <li>Pain relief</li>
    <li>Fever treatment</li>
  </ul>

  <h2>Benefits</h2>

  <h3>Pain Relief</h3>
  <p>Blocks brain's pain signals. Effective for:</p>
  <ul>
    <li>✓ Headaches</li>
    <li>✓ Nerve pain</li>
    <li>✓ Arthritis</li>
    <li>✓ Safest for pregnancy/breastfeeding</li>
  </ul>

  <h3>Fever Treatment</h3>
  <p>Reduces high temperature by inhibiting fever-causing chemicals.</p>

  <h2>Side Effects</h2>
  <p><em>Most are temporary</em>:</p>
  <ul>
    <li>Nausea/Vomiting</li>
    <li>Headache</li>
    <li>Constipation</li>
    <li>Insomnia</li>
  </ul>

  <h2>How to Use</h2>
  <ol>
    <li>Swallow whole with food</li>
    <li>Follow prescribed dosage</li>
    <li>Never exceed 4 doses/day</li>
  </ol>

  <h2>Safety Advice</h2>
  <table border="1">
    <tr>
      <th>Category</th>
      <th>Status</th>
      <th>Details</th>
    </tr>
    <tr>
      <td>Alcohol</td>
      <td>❌ UNSAFE</td>
      <td>Causes drowsiness</td>
    </tr>
    <tr>
      <td>Pregnancy</td>
      <td>⚠️ CONSULT MD</td>
      <td>Potential fetal risk</td>
    </tr>
    <tr>
      <td>Kidney</td>
      <td>⚠️ CAUTION</td>
      <td>Dose adjustment may be needed</td>
    </tr>
  </table>

  <h2>Missed Dose</h2>
  <ul>
    <li>Take ASAP if remembered</li>
    <li>Skip if near next dose time</li>
    <li><strong>Never double dose</strong></li>
  </ul>
</div>
`,
  pack_of: null,
  ideal_for: null,
  package_type: null,
};
const mockProduct2 = {
  _id: '1',
  name: 'Paracetamol 500mg Tablets',
  title: 'Paracetamol 500mg Tablets',
  price: 199.99,
  ptr: 150.50,
  mrp: 220.00,
  buy: null,
  get: 1,
  discount: 10,
  inStock: 250,
  sold: 1200,
  quantity: {
    value: 16,
    unit: 'tablets',
    package: 'box'
  },
  dosageForm: 'Tablet',
  manufacturer: 'HealthCare Pharma',
  purchases: 1250,
  images: [
    {
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop',
      _id: '1-1'
    },
    {
      url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400&auto=format&fit=crop',
      _id: '1-2'
    }
  ],
  product_info : `<div>
  <h1>Dolo 650 Tablet</h1>

  <p><strong>NPPA Regulated</strong><br>
  <strong>Marketer</strong>: Micro Labs Ltd</p>

  <h2>Salt Composition</h2>
  <ul>
    <li><strong>Active Ingredient</strong>: Paracetamol (650mg)</li>
    <li><strong>Salt Synonyms</strong>: Acetaminophen</li>
  </ul>

  <h2>Storage</h2>
  <p>Store below 25°C</p>

  <h2>Product Introduction</h2>
  <p>Dolo 650 Tablet helps relieve pain and fever by blocking chemical messengers. Used for:</p>
  <ul>
    <li>Headaches, migraine</li>
    <li>Toothaches, sore throat</li>
    <li>Period pains, arthritis</li>
    <li>Common cold</li>
  </ul>
  <p><strong>COVID-19 Note</strong>: Widely prescribed during the pandemic.</p>

  <h2>Dosage</h2>
  <ul>
    <li>Take with food (max 4 doses/24 hours, ≥4 hour gaps)</li>
    <li>Swallow whole; do not crush/chew</li>
  </ul>

  <h2>Uses</h2>
  <ul>
    <li>Pain relief</li>
    <li>Fever treatment</li>
  </ul>

  <h2>Benefits</h2>

  <h3>Pain Relief</h3>
  <p>Blocks brain's pain signals. Effective for:</p>
  <ul>
    <li>✓ Headaches</li>
    <li>✓ Nerve pain</li>
    <li>✓ Arthritis</li>
    <li>✓ Safest for pregnancy/breastfeeding</li>
  </ul>

  <h3>Fever Treatment</h3>
  <p>Reduces high temperature by inhibiting fever-causing chemicals.</p>

  <h2>Side Effects</h2>
  <p><em>Most are temporary</em>:</p>
  <ul>
    <li>Nausea/Vomiting</li>
    <li>Headache</li>
    <li>Constipation</li>
    <li>Insomnia</li>
  </ul>

  <h2>How to Use</h2>
  <ol>
    <li>Swallow whole with food</li>
    <li>Follow prescribed dosage</li>
    <li>Never exceed 4 doses/day</li>
  </ol>

  <h2>Safety Advice</h2>
  <table border="1">
    <tr>
      <th>Category</th>
      <th>Status</th>
      <th>Details</th>
    </tr>
    <tr>
      <td>Alcohol</td>
      <td>❌ UNSAFE</td>
      <td>Causes drowsiness</td>
    </tr>
    <tr>
      <td>Pregnancy</td>
      <td>⚠️ CONSULT MD</td>
      <td>Potential fetal risk</td>
    </tr>
    <tr>
      <td>Kidney</td>
      <td>⚠️ CAUTION</td>
      <td>Dose adjustment may be needed</td>
    </tr>
  </table>

  <h2>Missed Dose</h2>
  <ul>
    <li>Take ASAP if remembered</li>
    <li>Skip if near next dose time</li>
    <li><strong>Never double dose</strong></li>
  </ul>
</div>
`,
  pack_of: null,
  ideal_for: null,
  package_type: null,
};


const mockProducts = [
  {
    _id: '1',
    name: 'Lemon Fresh Disinfectant Spray Lemon Fresh Disinfectant Spray',
    type: 'household',
    title: 'Multi-Surface Disinfectant (1L)',
    price: 149.99,
    mrp: 179.00,
    discount: 16,
    buy: 3,
    get: 1,
    inStock: 85,
    sold: 420,
    quantity: {
      value: 1,
      unit: 'litre',
      package: 'spray bottle'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400',
        _id: '2-1'
      }
    ],
    html_description: `
      <div>
        <h2>Multi-Surface Disinfectant</h2>
        <p>Kills 99.9% of germs including bacteria and viruses</p>
        <ul>
          <li>Fresh lemon fragrance</li>
          <li>No harsh chemical smell</li>
          <li>Works on most hard surfaces</li>
        </ul>
      </div>
    `,
    pack_of: '2 bottles',
    ideal_for: 'Kitchens, bathrooms, door handles',
    package_type: 'Trigger spray bottle',
    active_ingredients: 'Benzalkonium Chloride 0.1%',
    safety_warnings: ['Keep out of reach of children', 'Avoid contact with eyes']
  },
  {
    _id: '3',
    name: 'GentleTears Baby Shampoo',
    type: 'babies',
    title: 'Tear-Free Baby Shampoo (400ml)',
    price: 189.00,
    mrp: 220.00,
    discount: 14,
    inStock: 62,
    sold: 315,
    quantity: {
      value: 400,
      unit: 'ml',
      package: 'bottle'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596704017256-8eef5a45e55d?q=80&w=400',
        _id: '3-1'
      }
    ],
    html_description: `
      <div>
        <h2>GentleTears Baby Shampoo</h2>
        <p>Pediatrician-tested formula with natural ingredients</p>
        <ul>
          <li>Tear-free formula</li>
          <li>pH balanced for baby's skin</li>
          <li>No parabens or sulfates</li>
        </ul>
      </div>
    `,
    pack_of: '3 bottles',
    ideal_for: 'Newborns and sensitive skin',
    package_type: 'Flip-top bottle',
    age_range: '0-3 years',
    certifications: ['Dermatologically Tested', 'Hypoallergenic'],
    free_from: ['Parabens', 'Sulfates', 'Artificial Colors']
  },
  {
    _id: '2',
    name: 'Ibuprofen 200mg Capsules',
    title: 'Ibuprofen 200mg Capsules',
    price: 249.99,
    ptr: 205.80,
    mrp: 260.00,
    discount: 0,
    inStock: 180,
    sold: 950,
    quantity: {
      value: 20,
      unit: 'capsules',
      package: 'bottle'
    },
    dosageForm: 'Capsule',
    manufacturer: 'MediCorp',
    purchases: 980,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=400&auto=format&fit=crop',
        _id: '2-1'
      }
    ]
  },
  {
    _id: '33',
    name: 'Cetirizine 10mg Allergy Relief',
    title: 'Cetirizine 10mg Allergy Relief',
    price: 349.99,
    ptr: 290.00,
    mrp: 370.00,
    discount: 15,
    inStock: 75,
    sold: 430,
    quantity: {
      value: 30,
      unit: 'tablets',
      package: 'box'
    },
    dosageForm: 'Tablet',
    manufacturer: 'AllerCare',
    purchases: 450,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501501?q=80&w=400&auto=format&fit=crop',
        _id: '3-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1626716352340-b656d6e0408f?q=80&w=400&auto=format&fit=crop',
        _id: '3-2'
      }
    ]
  },
  {
    _id: '4',
    name: 'Vitamin D3 1000IU Supplements',
    title: 'Vitamin D3 1000IU Supplements',
    price: 599.99,
    ptr: 480.00,
    mrp: 620.00,
    discount: 20,
    inStock: 120,
    sold: 870,
    quantity: {
      value: 90,
      unit: 'softgels',
      package: 'bottle'
    },
    dosageForm: 'Softgel',
    manufacturer: 'VitaHealth',
    purchases: 890,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1577460551100-907fc391e3d6?q=80&w=400&auto=format&fit=crop',
        _id: '4-1'
      }
    ]
  },
  {
    _id: '5',
    name: 'Digital Blood Pressure Monitor',
    title: 'Digital Blood Pressure Monitor',
    price: 1999.99,
    ptr: 1650.00,
    mrp: 2100.00,
    discount: 5,
    inStock: 45,
    sold: 320,
    manufacturer: 'MediTech',
    purchases: 330,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631127376780-94db5779f951?q=80&w=400&auto=format&fit=crop',
        _id: '5-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=400&auto=format&fit=crop',
        _id: '5-2'
      }
    ]
  },
  {
    _id: '6',
    name: 'Multivitamin Complete Tablets',
    title: 'Multivitamin Complete Tablets',
    price: 799.99,
    ptr: 650.00,
    mrp: 850.00,
    discount: 0,
    inStock: 200,
    sold: 1100,
    quantity: {
      value: 60,
      unit: 'tablets',
      package: 'bottle'
    },
    dosageForm: 'Tablet',
    manufacturer: 'NutriWell',
    purchases: 1120,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616671276441-2f2d2c8a4de8?q=80&w=400&auto=format&fit=crop',
        _id: '6-1'
      }
    ]
  },
  {
    _id: '7',
    name: 'Digital Thermometer',
    title: 'Digital Thermometer',
    price: 599.99,
    ptr: 480.00,
    mrp: 650.00,
    discount: 0,
    inStock: 80,
    sold: 640,
    manufacturer: 'HealthTech',
    purchases: 650,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585828292920-638a2a78cb38?q=80&w=400&auto=format&fit=crop',
        _id: '7-1'
      }
    ]
  },
  {
    _id: '8',
    name: 'Omega-3 Fish Oil 1000mg',
    title: 'Omega-3 Fish Oil 1000mg',
    price: 899.99,
    ptr: 720.00,
    mrp: 950.00,
    discount: 25,
    inStock: 150,
    sold: 780,
    quantity: {
      value: 100,
      unit: 'softgels',
      package: 'bottle'
    },
    dosageForm: 'Softgel',
    manufacturer: 'OmegaHealth',
    purchases: 800,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584473457493-56c72219acf9?q=80&w=400&auto=format&fit=crop',
        _id: '8-1'
      }
    ]
  },
  {
    _id: '9',
    name: 'First Aid Kit - Complete',
    title: 'First Aid Kit - Complete',
    price: 1299.99,
    ptr: 1050.00,
    mrp: 1400.00,
    discount: 10,
    inStock: 60,
    sold: 290,
    manufacturer: 'SafeHealth',
    purchases: 300,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?q=80&w=400&auto=format&fit=crop',
        _id: '9-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=400&auto=format&fit=crop',
        _id: '9-2'
      }
    ]
  },
  {
    _id: '10',
    name: 'Glucosamine 500mg Joint Support',
    title: 'Glucosamine 500mg Joint Support',
    price: 999.99,
    ptr: 820.00,
    mrp: 1050.00,
    discount: 0,
    inStock: 0, // Out of stock
    sold: 420,
    quantity: {
      value: 90,
      unit: 'tablets',
      package: 'bottle'
    },
    dosageForm: 'Tablet',
    manufacturer: 'JointCare',
    purchases: 425,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584308666989-a23e38259d70?q=80&w=400&auto=format&fit=crop',
        _id: '10-1'
      }
    ]
  },
  {
    _id: '11',
    name: 'Zinc Lozenges - Immune Support',
    title: 'Zinc Lozenges - Immune Support',
    price: 399.99,
    ptr: 320.00,
    mrp: 420.00,
    discount: 5,
    inStock: 95,
    sold: 510,
    quantity: {
      value: 45,
      unit: 'lozenges',
      package: 'box'
    },
    dosageForm: 'Lozenge',
    manufacturer: 'ImmuneWell',
    purchases: 520,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559149251-e9a1dc89a5f6?q=80&w=400&auto=format&fit=crop',
        _id: '11-1'
      }
    ]
  },
  {
    _id: '12',
    name: 'Diabetic Blood Glucose Monitor',
    title: 'Diabetic Blood Glucose Monitor',
    price: 2499.99,
    ptr: 2100.00,
    mrp: 2650.00,
    discount: 15,
    inStock: 35,
    sold: 280,
    manufacturer: 'DiaCare',
    purchases: 290,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598885159329-35f9dd271638?q=80&w=400&auto=format&fit=crop',
        _id: '12-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1565071783280-719b01b29912?q=80&w=400&auto=format&fit=crop',
        _id: '12-2'
      }
    ]
  }
];

const { cartItems, totalItems, totalPrice, totalDiscount } = useSelector(state => state.cart)
  
    return (
      <ScrollView> 
       <EmptySearchList/>
        <CartScreen/>

<SigninPromoRenderer/>

<CartInfo/>
<DiscountCartItem/>



        <FreeShipping/>

        

    
       
      
      <ProductPrice mrp={234.34} ptr={134.23} inStock={10} />


      <ProductPrice mrp={234.34} ptr={134.23} inStock={10} />


      <ProductPrice mrp={234.34} ptr={134.23} inStock={10} singleProduct />

      
        <ProductCard product={mockProduct1} vertical={true} />

        <ProductCard product={mockProduct2} vertical={true} />

        <Description description={mockProduct1.product_info} />

    <Info 
      html_description={mockProduct1.product_info}
      pack_of={mockProduct1.pack_of}
      quantity={`${mockProduct1.quantity.value} ${mockProduct1.quantity.unit}`}
      ideal_for={mockProduct1.ideal_for}
      package_type={mockProduct1.package_type}
    />
    <Info 
      html_description={mockProducts[0].html_description}
      pack_of={mockProducts[0].pack_of}
      quantity={`${mockProducts[0].quantity.value} ${mockProducts[0].quantity.unit}`}
      ideal_for={mockProducts[0].ideal_for}
      package_type={mockProducts[0].package_type}
    />
        <View>
        <ResponsiveImage source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' }} alt="Test image" style={testStyles.testImage}/>
        <ImageGallery images={mockProduct1.images} productName={mockProduct1.name} />
        </View>
        <ProductCard product={mockProduct1}/>
        

      <HorizontalProductCarousel 
      title="New Arrivals" 
      products={mockProducts} 
      viewAllLink="/products?sort=createdAt" 
      maxItems={10}
    />


        <TestFetch />
        
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




const testStyles = StyleSheet.create({
  testImage: {
    width: moderateScale(300),
    height: moderateVerticalScale(200),
    borderRadius: moderateScale(8),
    marginVertical: moderateVerticalScale(10),
    alignSelf: 'center',
  }
});


export default Test