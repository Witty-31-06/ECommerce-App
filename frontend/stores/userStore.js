import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  
} from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion, collection, addDoc, deleteField, getDoc, Timestamp } from "firebase/firestore";
import { useNuxtApp } from "#app";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    cart: {},
    price: 0,
    unsubscribeAuth: null,
    error: null,
  }),

  actions: {
    async register(email, password, name) {
      const { $auth, $db } = useNuxtApp();
      try {
        const userCredential = await createUserWithEmailAndPassword($auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });
        await user.reload(); // ✅ Ensure displayName is updated in Firebase

        await setDoc(doc($db, "users", user.uid), {
          name,
          email,
          cart: {},
          orders: [],
        });

        this.user = { uid: user.uid, name, email };
      } catch (error) {
        this.error = error.message;
      }
    },

    async login(email, password) {
      const { $auth, $db } = useNuxtApp();
      try {
        const userCredential = await signInWithEmailAndPassword($auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc($db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.user = { uid: user.uid, displayName: user.displayName, ...userData }; // ✅ Ensure displayName is set
          this.cart = userData.cart || {};
          this.orders = userData.orders || [];
        }
      } catch (error) {
        this.error = error.message;
      }
      console.log("User logged in:", this.user);
    
    },

    async logout() {
      const { $auth } = useNuxtApp();
      try {
        await $auth.signOut();
        this.user = null;
        this.cart = {}; // ✅ Ensure cart resets on logout
      } catch (error) {
        this.error = error.message;
      }
    },

    async addToCart(productId) {
      if (!this.cart) {
        this.cart = {};
      }

      this.cart[productId] = (this.cart[productId] || 0) + 1;

      console.log("Updated cart:", this.cart);

      if (this.user) {
        const { $db } = useNuxtApp();
        await setDoc(doc($db, "users", this.user.uid), { cart: this.cart }, {merge: true});
      }
    },
    async deleteFromCart(id) {
      if (!this.cart || !this.cart[id]) {
        console.warn(`Product ${id} not found in cart.`);
        return;
      }
    
      // Backup current cart in case Firestore update fails
      const previousCart = { ...this.cart };
    
      // Create a copy of the cart and delete the item
      const updatedCart = { ...this.cart };
      delete updatedCart[id];
    
      console.log("Updated Cart:", updatedCart);
    
      // Update local cart reactively
      this.cart = { ...updatedCart };
    
     
      if (this.user) {
        const { $db } = useNuxtApp();
        try {
          await updateDoc(doc($db, "users", this.user.uid), {
            [`cart.${id}`]: deleteField()
          });
          console.log(`Product ${id} deleted from cart successfully.`);
        } catch (error) {
          console.error("Failed to update Firestore:", error);
          this.cart = previousCart; // Restore previous cart in case of failure
        }
      }
    },
    async placeOrder(address, paymentMethod, deliveryDate) {
      const formattedDate = `${deliveryDate.year}-${(deliveryDate.month + 1).toString().padStart(2, '0')}-${deliveryDate.day.toString().padStart(2, '0')}`;

      console.log(formattedDate);  // Example output: "2024-11-03"
      console.log(address, paymentMethod, formattedDate);
      if (!this.user) {
        console.error("User not logged in.");
        return;
      }
    
      if (!this.cart || Object.keys(this.cart).length === 0) {
        console.error("Cart is empty. Cannot place an order.");
        return;
      }
    
      const { $db } = useNuxtApp();
      const userId = this.user.uid;
    
      try {

        const orderRef = await addDoc(collection($db, "orders"), {
          userId,
          address, 
          paymentMethod,
          paymentAmount: this.price,
          deliveryDate: formattedDate,           
          cart: this.cart,
          createdAt: Timestamp.now() 
        });
    
        const orderId = orderRef.id; 
        await updateDoc(doc($db, "users", userId), {
          orders: arrayUnion(orderId),
          cart: deleteField() 
        });
    
        // ✅ Clear local cart
        this.cart = {};
    
        console.log(`Order placed successfully with ID: ${orderId}`);
      } catch (error) {
        console.error("Failed to place order:", error);
      }
    },

    async updateCart(id, quantity) {
      if (!this.cart) {
        this.cart = {};
      }

      if (quantity <= 0) {
        delete this.cart[id];
      } else {
        this.cart[id] = quantity;
      }


      if (this.user) {
        const { $db } = useNuxtApp();
        await setDoc(doc($db, "users", this.user.uid), { cart: this.cart }, {merge: true});
      }
    }
    ,
    initAuth() {
      const { $auth, $db } = useNuxtApp();
      if (this.unsubscribeAuth) {
        this.unsubscribeAuth();
      }

      this.unsubscribeAuth = onAuthStateChanged($auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc($db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            this.user = { uid: firebaseUser.uid, displayName: firebaseUser.displayName, ...userData };
            this.cart = userData.cart || {};
            console.log("User logged in:", this.user);
          }
        } else {
          this.user = null;
          this.cart = {};
          console.log("User not logged in");
        }
      });
    },

    cleanupAuthListener() {
      if (this.unsubscribeAuth) {
        this.unsubscribeAuth();
        this.unsubscribeAuth = null;
        console.log("Unsubscribed from onAuthStateChanged");
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "userStore",
        storage: localStorage,
      },
    ],
  },
});
