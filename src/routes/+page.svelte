<script lang="ts">
  import { PRODUCTS } from '$lib/data/products.js';
  import TypewriterTitle from '$lib/components/TypewriterTitle.svelte';
  import ProductView from '$lib/components/ProductView.svelte';
  import { ChevronRight, ChevronLeft, Star } from '@lucide/svelte';

  let currentIndex = $state(0);
  let scrollContainer: HTMLDivElement | null = null;
  
  const allProducts = PRODUCTS;
  const REVIEWS = [
    { author: 'Happy Customer', text: 'Premium quality and fantastic design. Absolutely love this product!', rating: 5, date: '2 days ago' },
    { author: 'Merch Fan', text: 'Comfortable fit and the colors pop. Perfect for campus events!', rating: 5, date: '1 week ago' },
    { author: 'Club Member', text: 'Sleek look, great quality, and delivered quickly. Highly recommend.', rating: 5, date: '3 weeks ago' }
  ];
  const reviewItems = [...REVIEWS, ...REVIEWS];
  
  $effect(() => {
    if (scrollContainer) {
      const currentContainer = scrollContainer;
      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          const newIndex = e.deltaX > 0 
            ? Math.min(currentIndex + 1, allProducts.length - 1)
            : Math.max(currentIndex - 1, 0);
          if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateScroll();
          }
        }
      };
      
      currentContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => currentContainer.removeEventListener('wheel', handleWheel);
    }
  });

  function updateScroll() {
    if (scrollContainer) {
      scrollContainer.scrollTo({
        left: currentIndex * scrollContainer.offsetWidth,
        behavior: 'smooth'
      });
    }
  }
  
  function nextProduct() {
    if (currentIndex < allProducts.length - 1) {
      currentIndex++;
      updateScroll();
    }
  }
  
  function prevProduct() {
    if (currentIndex > 0) {
      currentIndex--;
      updateScroll();
    }
  }
  
  function handleScroll(e: Event) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const scrollLeft = target.scrollLeft;
    const containerWidth = target.offsetWidth;
    currentIndex = Math.round(scrollLeft / containerWidth);
  }
</script>

<!-- Product view is rendered by ProductView.svelte -->

<svelte:head>
  <style>
    body {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  </style>
</svelte:head>

<div class="w-full min-h-screen bg-black flex flex-col relative font-sans overflow-hidden">
  
  <div class="relative z-10 w-full pt-16 sm:pt-24 px-4">
    <div class="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
      <h1 class="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-[#ff6b00] tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(255,107,0,0.5)] uppercase">
        ML Club
      </h1>
      
      <div class="flex items-center space-x-4 mb-8 w-full max-w-3xl mx-auto justify-center opacity-90">
        <div class="h-px grow max-w-20 sm:max-w-30 bg-linear-to-r from-transparent to-[#ff6b00]"></div>
        <h2 class="text-xl sm:text-2xl md:text-3xl text-[#ff6b00] font-bold tracking-[0.3em] uppercase whitespace-nowrap">
          Exclusive Merch
        </h2>
        <div class="h-px grow max-w-20 sm:max-w-30 bg-linear-to-l from-transparent to-[#ff6b00]"></div>
      </div>
      
      <div class="mt-2 text-gray-400 font-mono opacity-80 flex justify-center w-full">
        <TypewriterTitle />
      </div>
    </div>
  </div>

  <div class="relative flex-1 flex items-center justify-center w-full pb-24">
    
    <button 
      onclick={prevProduct}
      disabled={currentIndex === 0}
      class="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-30 items-center justify-center w-14 h-14 rounded-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 hover:border-[#ff6b00] hover:bg-[#ff6b00]/10 disabled:opacity-0 transition-all group shadow-xl"
    >
      <ChevronLeft class="w-6 h-6 text-gray-400 group-hover:text-[#ff6b00] transition-colors" />
    </button>

    <div 
      bind:this={scrollContainer}
      onscroll={handleScroll}
      class="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      {#each allProducts as product, idx (product.id)}
        <ProductView {product} isVisible={currentIndex === idx} />
      {/each}
    </div>

    <button 
      onclick={nextProduct}
      disabled={currentIndex === allProducts.length - 1}
      class="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 z-30 items-center justify-center w-14 h-14 rounded-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 hover:border-[#ff6b00] hover:bg-[#ff6b00]/10 disabled:opacity-0 transition-all group shadow-xl"
    >
      <ChevronRight class="w-6 h-6 text-gray-400 group-hover:text-[#ff6b00] transition-colors" />
    </button>

  </div>

  <div class="relative z-10 w-full px-4 md:px-12 py-16 md:py-24 bg-linear-to-b from-black via-black to-[#0a0a0a]">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-black text-white mb-12">Customer Reviews</h2>
      
      <div class="relative overflow-hidden">
        <div class="reviews-track flex gap-6 py-4">
          {#each reviewItems as review, idx}
            <div class="min-w-70 md:min-w-80 p-6 rounded-[28px] border border-[#ff6b00]/20 bg-black/40 backdrop-blur-sm transition-all hover:border-[#ff6b00]/50">
              <div class="flex gap-1 mb-4">
                {#each Array(5) as _, starIdx}
                  <Star
                    class="w-4 h-4"
                    fill={starIdx < review.rating ? '#ff6b00' : 'none'}
                    stroke="#ff6b00"
                  />
                {/each}
              </div>
              <p class="text-gray-300 mb-4 text-sm leading-relaxed">"{review.text}"</p>
              <p class="text-[#ff6b00] font-mono text-sm">- {review.author}</p>
              <p class="text-xs text-gray-500 mt-2">{review.date}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <style>
    .reviews-track {
      animation: marquee 28s linear infinite;
      width: max-content;
    }

    .reviews-track:hover {
      animation-play-state: paused;
    }

    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  </style>

  <footer class="w-full bg-[#0a0a0a] border-t border-[#ff6b00]/20 shadow-[0_-10px_20px_rgba(255,107,0,0.2)] z-10">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-800 pb-6">
        <div class="flex items-center space-x-4 mb-6 md:mb-0">
          <img src="/logo.png" alt="ML Club Logo" class="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg" />
          <div class="flex flex-col">
            <span class="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Machine Learning <span class="text-[#ff6b00]">Club</span>
            </span>
            <span class="text-xs sm:text-sm font-medium text-[#ff6b00] tracking-widest mt-1">
              NIT SILCHAR
            </span>
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-gray-400 text-xs sm:text-sm">
          Copyright © 2025 - All rights reserved by <span class="text-[#ff6b00] font-semibold">Machine Learning Club, NIT Silchar</span>
        </p>
      </div>
    </div>
  </footer>
</div>