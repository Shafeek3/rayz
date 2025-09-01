import { ProductList } from '../components/ProductList';

export const Earrings = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/category/earrings"
    heading="Earrings"
     
  />
);
