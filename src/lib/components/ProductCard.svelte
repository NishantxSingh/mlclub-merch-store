<script>
  import { ChevronRight } from '@lucide/svelte';
  let { product, displayProductId } = $props();

  let isHovered = $state(false);
  let realPrice = String(product.price);
  let hiddenPrice = realPrice[0] + 'X'.repeat(realPrice.length - 1);
  let priceDisplay = $state(hiddenPrice);
  let interval;

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
  class={`group relative flex flex-col min-h-[480px] sm:min-h-[520px] bg-[#0a0a0a]/80 backdrop-blur-[40px] rounded-[30px] sm:rounded-[40px] border border-white/10 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-[1.02] sm:hover:scale-[1.03] z-10 hover:z-20 hover:border-white/50 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)_inset,0_0_30px_rgba(255,255,255,0.2)] ${displayProductId === product.id ? 'shadow-[0_0_20px_rgba(255,255,255,0.2)] border-white/30' : ''}`}
>
  <div class="absolute top-0 -left-[150%] w-[150%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 z-50 transition-all duration-0 group-hover:duration-[1000ms] ease-in-out group-hover:left-[150%] pointer-events-none mix-blend-screen"></div>

  <div class="h-[240px] sm:h-[280px] w-full shrink-0 relative pointer-events-none" style="mask-image: linear-gradient(to bottom, black 80%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);">
    <img src={product.image} alt={product.name} class="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100" />
  </div>
  
  <div class="p-6 sm:p-8 flex flex-col flex-grow relative z-20">
    <div class="mb-4 sm:mb-6">
      <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100 mb-2 sm:mb-3 group-hover:text-orange-400 transition-colors duration-300 flex-wrap">{product.name}</h3>
      <p class="text-xs sm:text-sm lg:text-base text-gray-400 font-mono leading-relaxed">{product.description}</p>
    </div>
    
    <div class="flex items-center justify-between mt-auto pt-4 sm:pt-5 border-t border-gray-800 transition-colors">
      <div class="flex flex-col">
        <span class="text-[8px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">Value</span>
        <span class="text-xl sm:text-2xl font-mono font-bold text-[#F5F5DC]">₹{priceDisplay}</span>
      </div>
      
      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/40 border border-gray-700 group-hover:bg-[#ff6b00]/10 group-hover:border-[#ff6b00] group-hover:shadow-[0_0_20px_rgba(255,107,0,0.6)] flex items-center justify-center transition-all duration-300 backdrop-blur-md">
        <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-[#ff6b00] transition-colors" />
      </div>
    </div>
  </div>
</a>