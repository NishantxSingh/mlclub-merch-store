<script>
  import { ShoppingCart, User, ShoppingBag } from '@lucide/svelte';
  
  let { cart = [] } = $props();
</script>

<div class="w-full bg-gray-950 md:bg-black/80 md:backdrop-blur-lg flex justify-center sticky top-0 z-[9999] border-b border-gray-900">
  <div class="w-full flex justify-between items-center h-20 sm:h-24 md:h-28 px-4 sm:px-8 md:px-12 relative overflow-hidden">
    
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-full flex justify-center px-4">
        <div class="flex items-center space-x-3 sm:space-x-4 drop-shadow-lg">
          <span 
            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 tracking-widest whitespace-nowrap"
            style="font-family: 'Allura', cursive;"
          >
               Merchandise
           </span>
           <ShoppingBag class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/80" stroke-width={1.5} />
        </div>
    </div>

    <div class="flex items-center shrink-0 z-20">
      <a href="/" class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-3 sm:mr-4 transition-transform hover:scale-105">
        <img src="/logo.png" alt="ML Club Logo" class="h-full w-full rounded-full object-cover border border-gray-800" />
      </a>
      
      <a href="https://www.mlclubnits.com/" target="_blank" rel="noopener noreferrer" class="hidden lg:block text-lg xl:text-xl tracking-wide hover:opacity-80 transition-opacity">
        <span class="text-[#ff6b00] font-bold">Machine Learning Club, </span>
        <span class="text-white font-normal">NIT Silchar</span>
      </a>
    </div>

    <div class="flex-none flex items-center space-x-4 sm:space-x-6 md:space-x-8 z-20 shrink-0">
      <a href="/account" class="text-gray-300 hover:text-[#ff6b00] transition-transform hover:scale-110">
        <User class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
      </a>
      
      <a href="/checkout" class="relative text-gray-300 hover:text-[#ff6b00] transition-transform hover:scale-110">
        <ShoppingCart class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        
        {#if cart && cart.length > 0}
          <span class="absolute -top-2 -right-2 md:-top-2 md:-right-3 inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-[10px] md:text-xs font-bold text-black bg-[#ff6b00] rounded-full">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        {/if}
      </a>
    </div>

  </div>
</div>