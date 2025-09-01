import { ProductList } from '../components/ProductList';

export const Necklace = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/category/necklaces"
    heading="Necklace"
     
  />
);