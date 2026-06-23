<script>
  import { onMount, getContext } from 'svelte';
  import { ArrowLeft, CreditCard, ShoppingBag, CheckCircle, Loader2, Lock } from '@lucide/svelte';

  const cartStore = getContext('cartStore');
  let cart = $derived(cartStore?.cart || []);

  let savedAddresses = $state([]);
  let mousePos = $state({ x: 0, y: 0 });
  let step = $state('form'); // 'form' | 'otp' | 'processing' | 'success'
  let otp = $state('');
  let otpError = $state('');

  let formData = $state({ name: '', email: '', phone: '', address: '' });

  let cartTotal = $derived(cart.reduce((total, item) => total + (item.price * item.quantity), 0));

  onMount(() => {
    const profileStr = localStorage.getItem('mlclub_user_profile');
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      const addressesArray = profile.addresses?.length ? profile.addresses : (profile.address ? [profile.address] : []);
      savedAddresses = addressesArray;

      formData = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: addressesArray.length > 0 ? addressesArray[0] : ''
      };
    }
  });

  function handleCheckout(e) {
    e.preventDefault();
    step = 'otp';
  }

  function handleVerifyOTP(e) {
    e.preventDefault();
    if (otp !== '123456') {
      otpError = 'Invalid code. Please use 123456 for this demo.';
      return;
    }
    otpError = '';
    step = 'processing';
    setTimeout(() => finalizeOrder(), 2500);
  }

  function finalizeOrder() {
    const orderId = `MLC-${Math.floor(Math.random() * 1000000)}`;
    const orderData = {
      orderId, timestamp: new Date().toISOString(), paymentStatus: "PAID_SUCCESS",
      customerInfo: formData, items: cart, totalPaid: cartTotal
    };

    const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${orderId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (cartStore) cartStore.cart = [];
    step = 'success';
  }

  function updateQuantity(id, size, delta) {
    if (!cartStore) return;
    let newCart = [...cartStore.cart];
    const index = newCart.findIndex(item => item.id === id && item.size === size);
    if (index !== -1) {
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) newCart.splice(index, 1);
      cartStore.cart = newCart;
    }
  }

  function handleMouseMove(e) {
    mousePos.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mousePos.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
</script>

<div class="w-full min-h-screen relative" onmousemove={handleMouseMove} role="presentation">
  <div class="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out opacity-60" style={`background-image: url('/bg.jpeg'); transform: scale(1.1) translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`}></div>
    <div class="absolute inset-0 bg-black/50"></div>
  </div>

  <div class="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
    {#if cart.length === 0 && step !== 'success'}
      <div class="text-center py-32">
        <ShoppingBag class="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h2 class="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
        <p class="text-gray-400 mb-8">Looks like you haven't added any ML Club gear yet.</p>
        <a href="/" class="inline-flex items-center px-6 py-3 bg-[#ff6b00] text-black font-bold rounded-xl hover:bg-[#e57b27] shadow-[0_0_15px_rgba(229,123,39,0.3)] transition-all">
          <ArrowLeft class="w-5 h-5 mr-2" /> Return to Store
        </a>
      </div>
    {:else}
      {#if step === 'form'}
        <a href="/" class="flex items-center text-gray-400 hover:text-[#ff6b00] transition-colors w-max mb-8"><ArrowLeft class="w-5 h-5 mr-2" /> Back to Home</a>
        <h1 class="text-3xl font-extrabold text-white mb-8">Checkout</h1>
      {/if}

      {#if step === 'form'}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2 space-y-8">
            <form id="checkout-form" onsubmit={handleCheckout} class="bg-white/[0.02] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[40px] border border-white/10 rounded-3xl p-8 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              <h2 class="text-xl font-bold text-white border-b border-gray-800 pb-4">Contact Information</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label class="block text-sm font-medium text-gray-400 mb-2">Full Name</label><input type="text" bind:value={formData.name} required class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00] transition-colors" /></div>
                <div><label class="block text-sm font-medium text-gray-400 mb-2">Email</label><input type="email" bind:value={formData.email} required class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00] transition-colors" /></div>
                <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-400 mb-2">Phone Number</label><input type="tel" bind:value={formData.phone} required class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00] transition-colors" /></div>
              </div>

              <h2 class="text-xl font-bold text-white border-b border-gray-800 pb-4 pt-4">Delivery Address</h2>
              {#if savedAddresses.length > 0 && savedAddresses[0] !== ''}
                <div class="space-y-3 mb-6">
                  <p class="text-sm text-gray-400">Select a saved address:</p>
                  {#each savedAddresses as addr}
                    <label class={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.address === addr ? 'bg-[#ff6b00]/10 border-[#ff6b00]' : 'bg-gray-800/80 border-gray-700 hover:border-gray-500'}`}>
                      <input type="radio" name="saved_address" value={addr} checked={formData.address === addr} onchange={(e) => formData.address = e.target.value} class="w-4 h-4 text-[#ff6b00] bg-gray-900 border-gray-600 focus:ring-[#ff6b00]" />
                      <span class="ml-3 text-white">{addr}</span>
                    </label>
                  {/each}
                </div>
              {/if}
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Confirm / Edit Address</label>
                <textarea bind:value={formData.address} required rows="3" class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00] transition-colors" placeholder="Where should we deliver this?"></textarea>
              </div>
            </form>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-white/[0.02] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[40px] border border-white/10 rounded-3xl p-8 sticky top-36 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              <h2 class="text-xl font-bold text-white border-b border-gray-800 pb-4 mb-6">Order Summary</h2>
              <div class="space-y-6 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {#each cart as item}
                  <div class="flex justify-between items-start text-sm">
                    <div class="flex items-start space-x-4">
                      <div class="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700"><img src={item.image} alt={item.name} class="w-full h-full object-cover opacity-90" /></div>
                      <div class="flex flex-col">
                        <p class="text-white font-medium line-clamp-1 mb-1">{item.name}</p>
                        <p class="text-gray-500 mb-2">Size: {item.size}</p>
                        <div class="flex items-center bg-gray-800/80 border border-gray-700 rounded-md w-max">
                          <button type="button" onclick={() => updateQuantity(item.id, item.size, -1)} class="px-3 py-1 text-gray-400 hover:text-[#ff6b00] hover:bg-gray-700 transition-colors rounded-l-md cursor-pointer">-</button>
                          <span class="px-3 text-white text-xs font-bold w-8 text-center">{item.quantity}</span>
                          <button type="button" onclick={() => updateQuantity(item.id, item.size, 1)} class="px-3 py-1 text-gray-400 hover:text-[#ff6b00] hover:bg-gray-700 transition-colors rounded-r-md cursor-pointer">+</button>
                        </div>
                      </div>
                    </div>
                    <span class="text-[#F5F5DC] font-bold mt-1 whitespace-nowrap">₹{item.price * item.quantity}</span>
                  </div>
                {/each}
              </div>
              <div class="border-t border-gray-800 pt-4 space-y-3">
                <div class="flex justify-between text-gray-400 text-sm"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                <div class="flex justify-between text-gray-400 text-sm"><span>Campus Delivery</span><span class="text-green-500">Free</span></div>
                <div class="flex justify-between text-white font-bold text-xl pt-3 border-t border-gray-800"><span>Total</span><span class="text-[#ff6b00]">₹{cartTotal}</span></div>
              </div>
              <button form="checkout-form" type="submit" class="cursor-pointer w-full mt-8 flex items-center justify-center py-4 bg-[#ff6b00] hover:bg-[#e57b27] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(229,123,39,0.3)] transition-all hover:scale-[1.02]">
                <CreditCard class="w-5 h-5 mr-2" /> Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      {:else if step === 'otp'}
        <div class="max-w-md mx-auto mt-12">
          <div class="bg-white/[0.02] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[40px] border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center">
            <div class="w-16 h-16 bg-[#ff6b00]/10 rounded-full flex items-center justify-center mx-auto mb-6"><Lock class="w-8 h-8 text-[#ff6b00]" /></div>
            <h2 class="text-2xl font-bold text-white mb-2">Security Verification</h2>
            <p class="text-gray-400 mb-8 text-sm">For your security, please enter the 6-digit OTP sent to your registered email/phone.<br/><span class="text-[#ff6b00] font-mono text-xs">(Use 123456)</span></p>
            <form onsubmit={handleVerifyOTP} class="space-y-6">
              <div>
                <input type="text" maxlength="6" value={otp} oninput={(e) => otp = e.target.value.replace(/\D/g, '')} class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white font-mono focus:outline-none focus:border-[#ff6b00] transition-colors" placeholder="••••••" required />
                {#if otpError}<p class="text-red-500 text-sm mt-2">{otpError}</p>{/if}
              </div>
              <div class="flex flex-col space-y-3">
                <button type="submit" class="cursor-pointer w-full py-4 bg-[#ff6b00] hover:bg-[#e57b27] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(229,123,39,0.3)] transition-all">Verify & Pay ₹{cartTotal}</button>
                <button type="button" onclick={() => step = 'form'} class="cursor-pointer w-full py-4 bg-transparent text-gray-400 hover:text-white font-medium transition-colors">Go Back</button>
              </div>
            </form>
          </div>
        </div>
      {:else if step === 'processing'}
        <div class="max-w-md mx-auto mt-24 text-center">
          <Loader2 class="w-16 h-16 text-[#ff6b00] animate-spin mx-auto mb-6" />
          <h2 class="text-2xl font-mono font-bold text-white mb-2">Processing Payment...</h2>
          <p class="text-gray-400 font-mono">Establishing secure connection</p>
        </div>
      {:else if step === 'success'}
        <div class="max-w-md mx-auto mt-12">
          <div class="bg-white/[0.02] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[40px] border border-green-500/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(34,197,94,0.15)] text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            <div class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20"><CheckCircle class="w-10 h-10 text-green-500" /></div>
            <h2 class="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p class="text-gray-400 mb-8">Order placed Successfully. Your gear is being prepared.</p>
            <a href="/" class="w-full inline-flex items-center justify-center py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition-colors">
              <ArrowLeft class="w-5 h-5 mr-2" /> Back to Store
            </a>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>