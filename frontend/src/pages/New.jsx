import { ProductList } from '../components/ProductList';

export const New = () => (
  <ProductList
    endpoint="/api/products/new-arrivals"
    heading="New Arrivals"
     
  />
);