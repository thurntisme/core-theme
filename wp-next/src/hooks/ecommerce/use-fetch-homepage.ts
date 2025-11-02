import apiClient from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

// Fetch categories
const fetchCategories = async () => {
  const response = await apiClient.get('/categories');
  return response;
};

// Fetch featured products
const fetchFeaturedProducts = async () => {
  const response = await apiClient.get('/featured-products');
  return response;
};

// Fetch hot deals
const fetchHotDeals = async () => {
  const response = await apiClient.get('/hot-deals');
  return response;
};

// Fetch latest articles
const fetchLatestArticles = async () => {
  const response = await apiClient.get('/latest-articles');
  return response;
};

// Custom hook to fetch homepage data
export default function useFetchHomepage() {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    data: featuredProducts,
    isLoading: isLoadingFeaturedProducts,
    isError: isErrorFeaturedProducts,
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });

  const {
    data: hotDeals,
    isLoading: isLoadingHotDeals,
    isError: isErrorHotDeals,
  } = useQuery({
    queryKey: ['hot-deals'],
    queryFn: fetchHotDeals,
  });

  const {
    data: latestArticles,
    isLoading: isLoadingLatestArticles,
    isError: isErrorLatestArticles,
  } = useQuery({
    queryKey: ['latest-articles'],
    queryFn: fetchLatestArticles,
  });

  return {
    categories,
    isLoadingCategories,
    isErrorCategories,
    featuredProducts,
    isLoadingFeaturedProducts,
    isErrorFeaturedProducts,
    hotDeals,
    isLoadingHotDeals,
    isErrorHotDeals,
    latestArticles,
    isLoadingLatestArticles,
    isErrorLatestArticles,
  };
}
