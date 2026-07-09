<script>
  import { AlertTriangle, X } from '@lucide/svelte';
  
  let isOpen = $state(false);
  $effect(() => {
    const timer = setTimeout(() => isOpen = true, 500);
    return () => clearTimeout(timer);
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-99999 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      onclick={() => isOpen = false}
      onkeydown={(e) => e.key === 'Enter' && (isOpen = false)}
      role="button"
      tabindex="0"
      aria-label="Close modal"
    ></div>

    <div class="relative w-full max-w-2xl bg-linear-to-br from-[#0a0a0a] via-black to-[#0a0a0a] backdrop-blur-2xl border border-[#ff6b00]/40 rounded-[40px] shadow-[0_0_80px_rgba(255,107,0,0.25),inset_0_0_40px_rgba(255,107,0,0.05)] overflow-hidden transform transition-all">
      
      <div class="absolute inset-0 rounded-[40px] p-0.5 bg-linear-to-r from-[#ff6b00]/50 via-[#ff8c00]/30 to-[#ff6b00]/50 pointer-events-none"></div>
      <div class="absolute inset-0.5 rounded-[40px] bg-linear-to-br from-[#0a0a0a] via-black to-[#0a0a0a]"></div>
      
      <div class="h-1 w-full bg-linear-to-r from-transparent via-[#ff6b00] to-transparent absolute top-0 left-0"></div>
      
      <button type="button" onclick={() => isOpen = false} class="absolute top-6 right-6 text-gray-400 hover:text-[#ff6b00] transition-all duration-300 hover:scale-110 z-30">
        <X class="w-6 h-6" />
      </button>

      <div class="relative z-20 p-8 sm:p-12">
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-[#ff6b00]/15 rounded-full flex items-center justify-center border border-[#ff6b00]/30 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
            <AlertTriangle class="w-10 h-10 text-[#ff6b00] animate-pulse" />
          </div>
        </div>
        
        <h2 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#ff6b00] to-[#ff8c00] text-center mb-6 font-mono tracking-wider uppercase">
          ⚠ Disclaimer
        </h2>
        
        <div class="space-y-4 text-gray-300 text-sm sm:text-base text-center mb-10 leading-relaxed">
          <p class="text-gray-400">Welcome to the <strong class="text-white">ML Club Merch Showcase</strong>!</p>
          <p>This website is a <strong class="text-[#ff6b00]">conceptual UI/UX demonstration project</strong> and <strong class="text-white">NOT</strong> the official merchandise store.</p>
          <p class="text-gray-500">Products, prices, and systems shown are <strong class="text-[#ff6b00]">entirely fictional</strong> and for display purposes only.</p>
        </div>
        
        <button type="button" onclick={() => isOpen = false} class="w-full py-4 bg-linear-to-r from-[#ff6b00] via-[#ff8c00] to-[#ff6b00] hover:shadow-[0_0_40px_rgba(255,107,0,0.5)] text-black font-bold font-mono rounded-2xl shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all transform hover:scale-[1.02] uppercase tracking-wider text-lg">
          I Understand & Continue
        </button>
      </div>
    </div>
  </div>
{/if}