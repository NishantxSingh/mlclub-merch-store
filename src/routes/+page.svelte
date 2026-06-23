<script>
  import { PRODUCTS } from '$lib/data/products.js';
  import { Terminal } from '@lucide/svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import ProductDetail from '$lib/components/ProductDetail.svelte';
  import TypewriterTitle from '$lib/components/TypewriterTitle.svelte';
  import { page } from '$app/stores';

  let mousePos = $state({ x: 0, y: 0 });
  
  // Reactively track the product ID from the URL search params (?id=1)
  let selectedId = $derived($page.url.searchParams.get('id'));
  let displayProduct = $derived(PRODUCTS.find(p => p.id === selectedId) || null);
  let isVisible = $derived(!!displayProduct);

  function handleMouseMove(e) {
    mousePos.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mousePos.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
</script>

<div class="w-full min-h-screen" onmousemove={handleMouseMove} role="presentation">
  
  <div class="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out opacity-60" style={`background-image: url('/bg.jpeg'); transform: scale(1.1) translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`}></div>
    <div class="absolute inset-0 bg-black/50"></div>
  </div>

  <div class="relative z-10 w-full flex items-start pt-4 sm:pt-8">
    
    <div class={`space-y-6 transition-all duration-500 ease-in-out ${isVisible ? 'w-full md:w-1/2 md:pr-4' : 'w-full pr-0'}`}>
      
      <div class="flex items-center justify-between px-4 lg:px-2 mb-4 sm:mb-6 border-b border-[#ff6b00]/20 pb-4">
        <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 pr-2">
          <Terminal class="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6b00] shrink-0" />
          <TypewriterTitle /> </div>
        
        <div class="flex items-center space-x-2 bg-[#ff6b00]/10 border border-[#ff6b00]/30 px-2 sm:px-3 py-1 rounded-md shrink-0">
          <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff6b00] animate-pulse"></div>
          <span class="text-[10px] sm:text-xs font-mono text-[#ff6b00] uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div class={`grid gap-6 sm:gap-8 transition-all duration-500 px-4 lg:px-2 pb-12 ${isVisible ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {#each PRODUCTS as product}
          <ProductCard {product} displayProductId={selectedId} />
        {/each}
      </div>
    </div>

    <div class={`transition-all duration-500 ease-in-out transform overflow-hidden z-[100] fixed inset-x-0 bottom-0 top-[112px] bg-black/95 sm:bg-black/80 backdrop-blur-3xl rounded-t-[30px] sm:rounded-t-[40px] border-t border-white/20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] md:fixed md:right-0 md:top-36 md:bottom-0 md:inset-auto md:bg-transparent md:backdrop-blur-none md:rounded-none md:border-none md:shadow-none md:z-auto md:origin-right ${isVisible ? 'translate-y-0 opacity-100 md:w-1/2 md:pl-4 md:pr-4' : 'translate-y-full opacity-0 md:w-0 md:translate-y-0 md:pl-0 md:pr-0'}`}>
      
      <div class="h-full md:h-auto w-full md:bg-white/[0.03] md:backdrop-blur-[40px] md:rounded-[40px] md:border border-white/10 md:shadow-[0_0_40px_rgba(0,0,0,0.5)] p-4 sm:p-6 overflow-y-auto custom-scrollbar" style="max-height: calc(100vh - 144px)">
        {#if displayProduct}
           <ProductDetail product={displayProduct} />
        {/if}
      </div>

    </div>

  </div>
</div>