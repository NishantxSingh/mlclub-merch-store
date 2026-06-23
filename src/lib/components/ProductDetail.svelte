<script>
  import { ShoppingCart, Zap, Star, MessageSquare, Send, X } from '@lucide/svelte';
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation'; 
  
  let { product } = $props();
  
  // THE FIX: We pull the whole store, then read the cart reactively using $derived
  const store = getContext('cartStore');
  let cart = $derived(store.cart);

  let topRef;
  let size = $state('L');
  let color = $state('');
  let added = $state(false);
  let showImage = $state(false);

  let reviews = $state([
    { id: 1, name: 'Alex M.', rating: 5, date: '2 days ago', text: 'Absolutely love the quality. The print is super crisp!' },
    { id: 2, name: 'Priya S.', rating: 4, date: '1 week ago', text: 'Great fit, but I wish there were more color options.' }
  ]);
  let newReview = $state({ name: '', text: '', rating: 5 });
  let hoveredStar = $state(0);

  $effect(() => {
    if (product) {
      size = 'L';
      color = product.colors?.[0] || '';
      added = false;
      showImage = false;
      
      const imageTimer = setTimeout(() => { showImage = true; }, 500);
      
      if (topRef && topRef.parentElement) {
        const scrollContainer = topRef.parentElement;
        const startPosition = scrollContainer.scrollTop;
        const startTime = performance.now();
        const animateScroll = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / 200, 1);
          scrollContainer.scrollTop = startPosition * (1 - (progress * (2 - progress)));
          if ((currentTime - startTime) < 200) requestAnimationFrame(animateScroll);
        };
        requestAnimationFrame(animateScroll);
      }
      return () => clearTimeout(imageTimer);
    }
  });

  let itemSize = $derived(product?.category === 'apparel' ? size : null);
  let itemColor = $derived(product?.category === 'apparel' ? color : null);
  
  // Now this correctly updates whenever the cart changes!
  let isItemInCart = $derived(cart.some(i => i.id === product.id && i.size === itemSize && i.color === itemColor));
  let avgRating = $derived((reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1));

  function handleToggleCart() {
    if (isItemInCart) {
      // Remove from cart
      store.cart = store.cart.filter(i => !(i.id === product.id && i.size === itemSize && i.color === itemColor));
    } else {
      // Add to cart
      store.addToCart(product, itemSize, itemColor);
      added = true;
      setTimeout(() => added = false, 2000);
    }
  }

  function handleBuyNow() {
    if (!isItemInCart) store.addToCart(product, itemSize, itemColor);
    goto('/checkout'); 
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    reviews = [{ id: Date.now(), name: newReview.name, rating: newReview.rating, text: newReview.text, date: 'Just now' }, ...reviews];
    newReview = { name: '', text: '', rating: 5 };
  }
</script>

<div class="w-full space-y-10 pb-10" bind:this={topRef}>
  <div class="flex justify-end items-center">
    <a href="/" class="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg">
      <X class="w-5 h-5" />
    </a>
  </div>

  <div class="flex flex-col space-y-16">
    <div class={`relative w-full max-w-sm mx-auto transition-opacity duration-700 ease-in-out ${showImage ? 'opacity-100' : 'opacity-0'}`}>
      <div class="relative w-full rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl z-10 aspect-square">
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/5 pointer-events-none z-20 mix-blend-overlay"></div>
        <img src={product.image} alt={product.name} class="w-full h-full object-cover relative z-10" />
      </div>
      <div class="absolute top-full left-0 w-full aspect-square mt-2 pointer-events-none z-0" style="-webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 40%); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 40%);">
        <img src={product.image} alt="reflection" class="w-full h-full object-cover rounded-3xl blur-[2px] -scale-y-100 opacity-60" />
      </div>
    </div>

    <div class="flex flex-col justify-start relative z-10 bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl border border-gray-800/50 shadow-xl">
      <h1 class="text-3xl font-extrabold text-white mb-4 tracking-tight">{product.name}</h1>
      <div class="flex items-center space-x-2 mb-4">
        <div class="flex text-[#ff6b00]">{#each [1, 2, 3, 4, 5] as star}<Star class={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-600'}`} />{/each}</div>
        <span class="text-gray-400 text-sm font-medium">({avgRating} / 5)</span>
      </div>
      <p class="text-2xl font-bold text-[#F5F5DC] mb-4">₹{product.price}</p>
      <p class="text-gray-300 text-base mb-8 leading-relaxed">{product.description}</p>

      {#if product.category === 'apparel'}
        <div class="space-y-6 mb-8">
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Select Size</h3>
            <div class="flex space-x-3">{#each ['S', 'M', 'L', 'XL'] as s}<button onclick={() => size = s} class={`cursor-pointer w-12 h-12 rounded-lg font-bold border transition-all ${size === s ? 'bg-[#ff6b00] text-black border-[#ff6b00]' : 'bg-gray-950 text-white border-gray-800 hover:border-[#ff6b00]'}`}>{s}</button>{/each}</div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Select Color</h3>
            <div class="flex flex-wrap gap-3">{#each product.colors as c}<button onclick={() => color = c} class={`cursor-pointer px-4 py-2 rounded-lg font-bold border transition-all ${color === c ? 'bg-[#ff6b00] text-black border-[#ff6b00]' : 'bg-gray-950 text-white border-gray-800 hover:border-[#ff6b00]'}`}>{c}</button>{/each}</div>
          </div>
        </div>
      {/if}

      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
        <button onclick={handleToggleCart} class={`cursor-pointer flex-1 py-4 rounded-xl font-bold flex items-center justify-center transition-all ${isItemInCart ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' : added ? 'bg-green-500 text-black scale-95' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'}`}>
          <ShoppingCart class="w-5 h-5 mr-2" /> 
          {isItemInCart ? 'Remove from Cart' : added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
        
        <button onclick={handleBuyNow} class="group cursor-pointer flex-1 py-4 bg-[#ff6b00] hover:bg-[#e57b27] text-black rounded-xl font-bold flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] overflow-hidden relative border border-transparent hover:border-white/30">
          <div class="absolute top-0 -left-[150%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 z-0 transition-all duration-700 ease-in-out group-hover:left-[150%] pointer-events-none"></div>
          
          <Zap class="w-5 h-5 mr-2 relative z-10 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-12" /> 
          <span class="relative z-10">Buy Now</span>
        </button>
      </div>
    </div>
  </div>

  <div class="pt-10 border-t border-gray-800/50 mt-10">
    <div class="flex items-center mb-6">
      <MessageSquare class="w-6 h-6 text-[#ff6b00] mr-3" />
      <h2 class="text-xl font-bold text-white">Community Reviews</h2>
    </div>
    
    <div class="space-y-6">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <form onsubmit={handleSubmitReview} class="space-y-4">
          <div class="flex space-x-1 mb-2">
            {#each [1, 2, 3, 4, 5] as star}
              <button type="button" onmouseenter={() => hoveredStar = star} onmouseleave={() => hoveredStar = 0} onclick={() => newReview.rating = star} class="focus:outline-none cursor-pointer"><Star class={`w-6 h-6 ${star <= (hoveredStar || newReview.rating) ? 'text-[#ff6b00] fill-[#ff6b00]' : 'text-gray-700'}`} /></button>
            {/each}
          </div>
          <input type="text" placeholder="Your Name" required bind:value={newReview.name} class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#ff6b00] outline-none" />
          <textarea rows="3" placeholder="What do you think about this gear?" required bind:value={newReview.text} class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#ff6b00] outline-none resize-none"></textarea>
          <button type="submit" class="cursor-pointer w-full bg-gray-800 hover:bg-[#ff6b00] hover:text-black text-white font-bold py-3 rounded-xl flex justify-center items-center transition-colors group">Post Review <Send class="w-4 h-4 ml-2" /></button>
        </form>
      </div>

      <div class="space-y-4">
        {#if reviews.length === 0}
          <p class="text-gray-500 italic">No reviews yet.</p>
        {:else}
          {#each reviews as review}
            <div class="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
              <div class="flex justify-between items-start mb-2">
                <div><h4 class="text-white font-bold">{review.name}</h4><p class="text-xs text-gray-500 mt-1">{review.date}</p></div>
                <div class="flex text-[#ff6b00]">{#each [1, 2, 3, 4, 5] as star}<Star class={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-700'}`} />{/each}</div>
              </div>
              <p class="text-gray-300 leading-relaxed text-sm">"{review.text}"</p>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>