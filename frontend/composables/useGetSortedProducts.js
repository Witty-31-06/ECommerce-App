import { ref } from "vue";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useNuxtApp } from "#app";
const error = ref(null);
const fetchProducts = async (orderByField = "addedOn", orderDirection = "desc", itemLimit = 10) => {
  const error = ref(null);
  const products = ref(null);

  try {
    const { $db } = useNuxtApp();
    console.log('db', $db);
    const q = query(
      collection($db, "products"),
      orderBy(orderByField, orderDirection),
      limit(itemLimit)
    );

    const querySnapshot = await getDocs(q);
    products.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching products:", err);
  } finally {

  }
  // console.log(products.value)
  return products.value

}

export const useGetSortedProducts = () => {

  return {
    error,
    fetchProducts,
  };
};
