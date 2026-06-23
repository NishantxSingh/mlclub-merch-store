<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import DisclaimerModal from '$lib/components/DisclaimerModal.svelte';
  
  // THE FIX: Moved setContext import to the top level!
  import { setContext } from 'svelte';

  let { children } = $props();

  // Reactive Global Cart State
  let cart = $state([]);

  // Global helper function to add items to the cart
  function addToCart(product, selectedSize, selectedColor) {
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      });
    }
  }

  // Provide cart state and actions to child pages natively
  // This must also run at the top level of the script block!
  setContext('cartStore', {
    get cart() { return cart; },
    set cart(val) { cart = val; },
    addToCart
  });
</script>

<div class="min-h-screen bg-black text-gray-100 font-sans selection:bg-[#ff6b00] selection:text-black relative">
  <DisclaimerModal />
  <Navbar {cart} />
  
  <main class="w-full relative z-10">
    {@render children()}
  </main>
</div>