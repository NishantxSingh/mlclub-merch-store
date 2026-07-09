<script lang="ts">
  let { product, displayProductId } = $props();

  let isHovered = $state(false);
  let realPrice = String(product.price);
  let hiddenPrice = realPrice[0] + 'X'.repeat(realPrice.length - 1);
  let priceDisplay = $state(hiddenPrice);
  let interval: ReturnType<typeof setInterval> | undefined;

  $effect(() => {
    let step = 0;
    let targetPrice = isHovered ? realPrice : hiddenPrice;

    clearInterval(interval);
    interval = setInterval(() => {
      step++;
      if (step > 6) {
        priceDisplay = targetPrice;
        clearInterval(interval);
      } else {
        priceDisplay = realPrice[0] + Array.from({ length: realPrice.length - 1 }, () => Math.floor(Math.random() * 10)).join('');
      }
    }, 40);

    return () => clearInterval(interval);
  });
</script>

<a 
  href={`/?id=${product.id}`}
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
  class="flex flex-col items-center group w-full outline-none"
>
  <div class={`relative w-full aspect-square bg-[#0a0a0a] rounded-[30px] sm:rounded-[40px] border transition-all duration-500 overflow-hidden ${displayProductId === product.id ? 'border-[#ff6b00] shadow-[0_0_30px_rgba(255,107,0,0.3)]' : 'border-gray-800 group-hover:border-[#ff6b00]'}`}>
    
    <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
      <div class="bg-[#ff6b00] text-black font-bold font-mono px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-[0_4px_15px_rgba(255,107,0,0.4)] transition-transform duration-300 group-hover:scale-105">
        ₹{priceDisplay}
      </div>
    </div>

    <img 
      src={product.image} 
      alt={product.name} 
      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
    />
  </div>

  <div class="mt-6 sm:mt-8 transform transition-transform duration-300 group-hover:-translate-y-2">
    <div class="bg-[#111] backdrop-blur-md border border-gray-800 group-hover:border-[#ff6b00] group-hover:bg-[#ff6b00]/10 transition-all duration-300 rounded-full px-8 sm:px-10 py-3 sm:py-4 shadow-xl">
      <h3 class="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ff6b00] transition-colors whitespace-nowrap">
        {product.name}
      </h3>
    </div>
  </div>
</a>