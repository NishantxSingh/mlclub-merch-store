<script>
  import { AlertTriangle, X } from '@lucide/svelte';
  
  let isOpen = $state(false);

  // Trigger modal display slightly after mount for a smooth transition
  $effect(() => {
    const timer = setTimeout(() => isOpen = true, 500);
    return () => clearTimeout(timer);
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick={() => isOpen = false}></div>

    <div class="relative w-full max-w-lg bg-gray-900/90 backdrop-blur-xl border border-[#ff6b00]/30 rounded-3xl shadow-[0_0_50px_rgba(255,107,0,0.15)] overflow-hidden transform transition-all p-6 sm:p-8">
      <div class="h-1 w-full bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent absolute top-0 left-0"></div>
      
      <button onclick={() => isOpen = false} class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
        <X class="w-5 h-5" />
      </button>

      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-[#ff6b00]/10 rounded-full flex items-center justify-center border border-[#ff6b00]/20">
          <AlertTriangle class="w-8 h-8 text-[#ff6b00]" />
        </div>
      </div>
      
      <h2 class="text-2xl font-bold text-white text-center mb-4 font-mono tracking-wide uppercase">
        Project Disclaimer
      </h2>
      
      <div class="space-y-4 text-gray-300 text-sm sm:text-base text-center mb-8 leading-relaxed">
        <p>Welcome! Please note that this website is a <strong class="text-white">conceptual UI/UX demo project</strong>.</p>
        <p>This is <strong class="text-[#ff6b00]">NOT</strong> the official merchandise store for the Machine Learning Club at NIT Silchar. The products, prices, and checkout systems shown here are entirely fictional and for display purposes only.</p>
      </div>
      
      <button onclick={() => isOpen = false} class="w-full py-4 bg-[#ff6b00] hover:bg-[#e57b27] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all transform hover:scale-[1.02] uppercase tracking-wider">
        I Understand
      </button>
    </div>
  </div>
{/if}