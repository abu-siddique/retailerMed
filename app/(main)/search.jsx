import { FlashList } from '@shopify/flash-list'
import { Link, Stack } from 'expo-router'
import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native'
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'

import {
  EmptySearchList,
  Icons,
  ShowWrapper
} from '@/component'
import useDebounce from '@/component/hooks/use_debounce'
import { useGetProductsQuery } from '@/component/services'
import { ProductCard } from '../../component'

export default function SearchScreen() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 1200)

  const {
    data,
    isSuccess,
    isFetching,
    error,
    isError,
    refetch,
    hasNextPage,
    originalArgs,
  } = useGetProductsQuery(
    {
      search,
      page,
      page_size: 10,
    },
    {
      skip: !debouncedSearch || search !== debouncedSearch,
      selectFromResult: ({ data, ...args }) => ({
        hasNextPage: data?.data?.pagination?.hasNextPage ?? false,
        data,
        ...args,
      }),
    }
  )
  console.log('Search Data:', data)
  const handleChange = value => {
    setSearch(value)
  }

  const onEndReachedThreshold = () => {
    if (!hasNextPage) return
    setPage(prev => prev + 1)
  }

  const handleRemoveSearch = () => {
    setSearch('')
    setPage(1)
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search',
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <View style={styles.iconWrapper}>
            <Icons.EvilIcons name="search" size={24} color="#1F2937" />
          </View>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={handleChange}
            placeholder="Search products..."
          />
          <Pressable onPress={handleRemoveSearch} style={styles.iconWrapper}>
            <Icons.AntDesign name="close" size={14} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.listWrapper}>
          <ShowWrapper
            error={error}
            isError={isError}
            refetch={refetch}
            isFetching={isFetching}
            isSuccess={isSuccess}
            dataLength={data ?  data?.data?.products.length : 0}
            emptyComponent={<EmptySearchList />}
            type="list"
            originalArgs={originalArgs}
          >
            <View style={styles.productList}>
              {data?.data?.products.length > 0 && search.length > 0 && (
                <FlashList
                  data={data?.data?.products}
                  renderItem={({ item }) => (
                    <View key={item._id} style={styles.productItem}>
                      <Link href={`/products/${item._id}`} asChild>
                        <Pressable>
                          {/* <ResponsiveImage
                            style={styles.productImage}
                            source={{ uri: item.images[0]?.url }}
                            alt={item.title}
                          />
                          <Text style={styles.productTitle}>
                            {truncate(item.title, 70)}
                          </Text>
                          <View style={styles.priceRow}>
                            <View>
                              {item.discount > 0 && (
                                <DiscountProduct discount={item.discount} />
                              )}
                            </View>
                            <ProductPrice
                              inStock={item.inStock}
                              discount={item.discount}
                              price={item.price}
                            />
                          </View> */}
                          <ProductCard product={item} vertical={false} cartops={true} />
                        </Pressable>
                      </Link>
                    </View>
                  )}
                  onEndReached={onEndReachedThreshold}
                  onEndReachedThreshold={0}
                  estimatedItemSize={200}
                />
              )}
            </View>
          </ShowWrapper>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: moderateScale(8),
  },
  iconWrapper: {
    padding: scale(8),
  },
  input: {
    flex: 1,
    padding: scale(8),
    fontSize: moderateScale(14),
    color: '#111827',
  },
  listWrapper: {
    flex: 1,
    paddingTop: verticalScale(12),
  },
  productList: {
    flex: 1,
    gap: verticalScale(12),
  },
  
  productItem: {
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  productImage: {
    width: moderateScale(100),
    height: moderateVerticalScale(100),
    borderColor: '#e2e8f0',
    resizeMode: 'contain',
  },
  productTitle: {
    paddingVertical: verticalScale(8),
    fontSize: moderateScale(14),
    color: '#111827',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
