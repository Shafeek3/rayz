import { ProductList } from '../components/ProductList';

export const Anklets = () => (
  <ProductList
    endpoint="http://localhost:5000/api/products/category/anklets"
    heading="Anklets"
    
  />
);