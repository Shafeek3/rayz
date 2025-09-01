import { ProductList } from '../components/ProductList';

export const New = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/new-arrivals"
    heading="New Arrivals"
     
  />
);