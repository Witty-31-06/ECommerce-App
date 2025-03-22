import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: {}
  }),

  actions: {
    async getProduct(id) {
      if (this.products[id]) {
        console.log("Returning cached product");
        return this.products[id];
      }
      if (process.server) {
        console.log("Skipping Firestore fetch on server");
        return null;
      }

      console.log("Fetching product from Firestore");

      const { $db } = useNuxtApp();
      const productRef = doc($db, "products", id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();
      this.products[id] = productData;

      return productData;
    },
  }
});
