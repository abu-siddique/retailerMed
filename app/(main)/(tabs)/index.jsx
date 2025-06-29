import { Link, Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import {
  Categories,
  DeliveryNotificationBanner,
  Slider as MainSlider,
  ShowWrapper
} from '@/component';



import { useGetFeedInfoQuery } from '@/component/services';
import HorizontalProductCarousel from '../../../component/common/horizontal_product_carousel';
import FeedHeader from '../../../component/feed_header';


export default function FeedScreen() {
  // //? Assets

  // //? Get Feeds Query
  // const {
  //   // data: { childCategories, currentCategory, sliders, bannerOneType, bannerTwoType },
  //   data,
  //   isLoading,
  //   isSuccess,
  //   isFetching,
  //   error,
  //   isError,
  //   refetch,
  // } = useGetFeedQuery(
  //   {},
  //   {
  //     selectFromResult: ({ data, ...args }) => ({
  //       data: data?.data || {},
  //       ...args,
  //     }),
  //   }
  // );

  //? Assets

  //? Get Categories Query
  const {
    data,
    isLoading,
    isSuccess,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetFeedInfoQuery(
    // No parameters needed as per your service implementation
    {},
    {
      selectFromResult: ({ data, ...args }) => ({
        data: data?.data || {},
        ...args,
      }),
    }
  );
  const {categories, new_arrivals_medicine, new_arrivals_surgical, top_selling_medicine, top_selling_surgical} = data || {};
  console.log('categories', categories);
  console.log('new_arrivals_medicine', new_arrivals_medicine);
  console.log('new_arrivals_surgical', new_arrivals_surgical);
  console.log('top_selling_medicine', top_selling_medicine);
  console.log('top_selling_surgical', top_selling_surgical);


  

  //? Render(s)
  return (
    <>
      <Stack.Screen
        options={{header: () => <FeedHeader />}}
      />
      <ShowWrapper
        isLoading={isLoading}
        error={error}
        isError={isError}
        refetch={refetch}
        isFetching={isFetching}
        isSuccess={isSuccess}
        type="detail"
      >
        <ScrollView style={styles.container}>
          <>
            <DeliveryNotificationBanner/>
            <MainSlider />
    

            <Categories categories={categories} />
            <HorizontalProductCarousel 
              title="New Arrivals On Medicine"
              products={new_arrivals_medicine}
              viewAllLink="/products?sort=createdAt"
              maxItems={10}
            />
            <HorizontalProductCarousel title={"New Arrivals On Surgical"}
              products={new_arrivals_surgical}
              viewAllLink="/products?sort=createdAt"
              maxItems={10}
            />
            <HorizontalProductCarousel
              title={"Top Selling On Medicine"}
              products={top_selling_medicine}
              viewAllLink="/products?sort=createdAt"
              maxItems={10}
            />
            <HorizontalProductCarousel
              title={"Top Selling On Surgical"}
              products={top_selling_surgical}
              viewAllLink="/products?sort=createdAt"
              maxItems={10}
            />

            {/* <DiscountSlider currentCategory={currentCategory} />
            <BannerOne data={bannerOneType} />
            <BestSellsSlider categorySlug={currentCategory?.slug} />
            <BannerTwo data={bannerTwoType} />
            <MostFavouraiteProducts categorySlug={currentCategory?.slug} />  */}
            <Link href={'/test'}>Go to Testt</Link>
          </>
        </ScrollView>
      </ShowWrapper>
      <Link href={'/test'}>Go to Testt</Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(12), // Equivalent to px-3 (assuming 1 = 4px)
  }
});

