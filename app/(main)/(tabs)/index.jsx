import { Link, Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import {
  Categories,
  DeliveryNotificationBanner,
  Slider as MainSlider,
  ShowWrapper
} from '@/component';



import { useGetCategoriesQuery } from '@/component/services';


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
  } = useGetCategoriesQuery(
    // No parameters needed as per your service implementation
    {},
    {
      selectFromResult: ({ data, ...args }) => ({
        data: data?.data || {},
        ...args,
      }),
    }
  );

  // Extract categories from the response
  const { categories } = data;

  //? Render(s)
  return (
    <>
      <Stack.Screen
        
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
            {/* <DiscountSlider currentCategory={currentCategory} />
            <BannerOne data={bannerOneType} />
            <BestSellsSlider categorySlug={currentCategory?.slug} />
            <BannerTwo data={bannerTwoType} />
            <MostFavouraiteProducts categorySlug={currentCategory?.slug} />  */}
            <Link href={'/test'}>Go to Test</Link>
          </>
        </ScrollView>
      </ShowWrapper>
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

