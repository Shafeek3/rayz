import { ProductList } from '../components/ProductList';

export const Bangles = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/category/bangles"
    heading="Bangles"
    
  />
);