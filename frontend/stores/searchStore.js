import { collection, query, where, getDocs } from 'firebase/firestore';
import { defineStore } from 'pinia'

export const useMySearchStore = defineStore('mySearchStore',
  {
  state: () => ({ 
    results: [],
    error: null
  }),
  actions: {
    async searchProducts(searchTerm) {
      console.log(searchTerm)
      if (!searchTerm.trim()) {
        this.results = [];
        return;
      }
      this.error=null
      const loading = true;
      const lowerSearchTerm = searchTerm.toLowerCase();
      try {

        const {$db} = useNuxtApp()
        const productsRef = collection($db, 'products');
        const titleQuery = query(
          productsRef,
          where("title", ">=", lowerSearchTerm),  // Matches anything starting with searchTerm
          where("title", "<=", lowerSearchTerm + "\uf8ff") // Ensures we get all matching words
        );

        const categoryQuery = query(
          productsRef,
          where("category", "==", lowerSearchTerm)
        );

        const tagsQuery = query(
          productsRef,
          where("tags", "array-contains", lowerSearchTerm)
        );

        const [titleSnapshot, categorySnapshot, tagsSnapshot] = await Promise.all([
          getDocs(titleQuery),
          getDocs(categoryQuery),
          getDocs(tagsQuery)
        ]);

        const results = [
        ...titleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];
      // console.log(results)

      // Remove duplicate products by ID
      const uniqueResults = results.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );
      this.results = uniqueResults;
      loading = false
      
        
      } catch(err) {
        this.error = err
      }
      return {results: this.results, error: this.error, loading}
    }
  }
})
