import { ProductList } from '../components/ProductList';

export const Rings = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/category/rings"
    heading="Rings"
     
  />
);