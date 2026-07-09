<script lang="ts">
  import { onDestroy, getContext } from 'svelte';
  import { goto } from '$app/navigation';

  type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    colors?: string[];
    images?: Record<string, string>;
  };

  export let product: Product;
  export let isVisible: boolean = false;

  let isHovered = false;
  let priceDisplay = '';
  let interval: ReturnType<typeof setInterval> | null = null;
  let selectedColor: string | null = null;

  const cartStore: any = getContext('cartStore');

  $: realPrice = product ? String(product.price) : '0';
  $: hiddenPrice = realPrice ? realPrice[0] + 'X'.repeat(Math.max(0, realPrice.length - 1)) : '0';

  $: if (product) {
    // Initialize values when product changes
    priceDisplay = hiddenPrice;
    selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
  }

  $: currentImage = (selectedColor && product?.images && product.images[selectedColor]) ? product.images[selectedColor] : product?.image;

  function updatePriceDisplay() {
    if (interval) clearInterval(interval);
    let step = 0;
    const targetPrice = isHovered ? realPrice : hiddenPrice;

    interval = setInterval(() => {
      step++;
      if (step > 6) {
        priceDisplay = targetPrice;
        if (interval) { clearInterval(interval); interval = null; }
      } else {
        priceDisplay = realPrice[0] + Array.from({ length: Math.max(0, realPrice.length - 1) }, () => Math.floor(Math.random() * 10)).join('');
      }
    }, 40);
  }

  function handleAddToCart() {
    if (cartStore && cartStore.addToCart && product) {
      cartStore.addToCart(product, 'Default', selectedColor || 'Default');
      goto('/checkout');
    }
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="w-full min-w-full flex items-center justify-start px-4 md:px-12 lg:px-20 snap-center h-full">
  <div class="w-full max-w-6xl grid gap-10 lg:gap-16 lg:grid-cols-[1.2fr_1fr] items-center">
    
    <div 
      role="presentation"
      on:mouseenter={() => { isHovered = true; updatePriceDisplay(); }}
      on:mouseleave={() => { isHovered = false; updatePriceDisplay(); }}
      class="group relative rounded-4xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-4 md:p-6 shadow-[0_0_40px_rgba(255,107,0,0.05)] transition-all duration-500 hover:border-[#ff6b00]/50 hover:shadow-[0_0_50px_rgba(255,107,0,0.15)]"
    >
      <div class="relative overflow-hidden rounded-4xl border border-gray-800/50 bg-black">
        <div class="absolute top-6 right-6 z-20">
          <div class="bg-[#ff6b00] text-black font-bold font-mono px-5 py-3 rounded-2xl shadow-[0_4px_20px_rgba(255,107,0,0.5)] text-sm sm:text-base transition-transform duration-300 group-hover:scale-110">
            ₹{priceDisplay}
          </div>
        </div>

        <div class="absolute top-0 left-[-150%] w-[150%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 z-10 transition-all duration-0 group-hover:duration-1000 ease-in-out group-hover:left-[150%] pointer-events-none"></div>

        <div class="relative w-full aspect-4/5" style="-webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%); mask-image: linear-gradient(to bottom, black 85%, transparent 100%);">
          <img 
            src={currentImage}
            alt={product.name}
            class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>

    <div class={`flex flex-col justify-center text-left transition-all duration-700 delay-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
      <p class="text-[#ff6b00] text-sm font-mono uppercase tracking-[0.4em] mb-4">Exclusive Release</p>
      <h3 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
        {product.name}
      </h3>

      <p class="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 font-mono">
        {product.description}
      </p>

      {#if product.colors}
        <div class="mb-10">
          <p class="text-[0.75rem] font-mono uppercase tracking-[0.35em] text-gray-500 mb-4">Select Variant</p>
          <div class="flex flex-wrap gap-4">
            {#each product.colors as color}
              <button 
                on:click={() => selectedColor = color}
                class={`px-6 py-3 rounded-xl border backdrop-blur-md transition-all text-sm font-mono tracking-wider shadow-lg ${
                  selectedColor === color 
                    ? 'bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]' 
                    : 'border-white/10 bg-white/3 text-white hover:bg-[#ff6b00]/10 hover:text-[#ff6b00] hover:border-[#ff6b00]/50'
                }`}
              >
                {color}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <button 
        on:click={handleAddToCart}
        class="group relative w-full sm:w-auto self-start px-12 py-5 bg-[#ff6b00] hover:bg-[#e57b27] text-black font-extrabold rounded-2xl shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:shadow-[0_0_40px_rgba(255,107,0,0.5)] transition-all transform hover:-translate-y-1 uppercase tracking-widest overflow-hidden flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-3 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 21h18L12 2z" /></svg>
        <span class="relative z-10">Buy Now</span>
        <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] pointer-events-none"></div>
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
</style>