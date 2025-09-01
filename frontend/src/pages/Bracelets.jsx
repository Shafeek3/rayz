import { ProductList } from '../components/ProductList';

export const Bracelets = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/category/bracelets"
    heading="Bracelets"
     
  />
);