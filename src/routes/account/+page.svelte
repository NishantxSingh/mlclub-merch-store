<script>
  import { onMount } from 'svelte';
  import { Home as HomeIcon, User, MapPin, Phone, Mail, Camera, Edit2, Save, Plus, Trash2, Image as ImageIcon } from '@lucide/svelte';

  let isEditing = $state(false);
  let mousePos = $state({ x: 0, y: 0 });
  let formData = $state({ name: '', email: '', phone: '', addresses: [''], avatar: '', cover: '' });

  let fileInputRef;
  let coverInputRef;

  onMount(() => {
    const savedProfile = localStorage.getItem('mlclub_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      if (parsed.address && !parsed.addresses) parsed.addresses = [parsed.address];
      formData = {
        name: parsed.name || '', email: parsed.email || '', phone: parsed.phone || '',
        addresses: parsed.addresses?.length ? parsed.addresses : [''],
        avatar: parsed.avatar || '', cover: parsed.cover || ''
      };
      isEditing = false;
    } else {
      isEditing = true;
    }
  });

  function handleAddressChange(index, value) {
    formData.addresses[index] = value;
  }
  function addAddress() { formData.addresses.push(''); }
  function removeAddress(index) { formData.addresses.splice(index, 1); }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => formData.avatar = reader.result;
      reader.readAsDataURL(file);
    }
  }

  function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => formData.cover = reader.result;
      reader.readAsDataURL(file);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const cleanedAddresses = formData.addresses.filter(addr => addr.trim() !== '');
    formData.addresses = cleanedAddresses.length === 0 ? [''] : cleanedAddresses;
    localStorage.setItem('mlclub_user_profile', JSON.stringify(formData));
    isEditing = false;
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

  <div class="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
    <a href="/" class="flex items-center text-gray-400 hover:text-[#ff6b00] transition-colors w-max mb-8"><HomeIcon class="w-5 h-5 mr-2" /> Back to Home</a>

    <div class="bg-white/[0.02] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[40px] border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative">
      <div class="h-40 md:h-48 relative group bg-gray-900">
        {#if formData.cover}
          <img src={formData.cover} alt="Cover" class="w-full h-full object-cover opacity-80" />
        {:else}
          <div class="w-full h-full relative">
            <img src="/bg.jpeg" alt="Default Cover" class="w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-[#ff6b00]/20 mix-blend-overlay"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>
        {/if}
        {#if isEditing}
          <button type="button" onclick={() => coverInputRef.click()} class="absolute top-4 right-4 bg-black/60 hover:bg-black text-white px-4 py-2 rounded-xl flex items-center transition-all backdrop-blur-md border border-white/10 cursor-pointer">
            <ImageIcon class="w-4 h-4 mr-2" /> Edit Cover
          </button>
          <input type="file" bind:this={coverInputRef} onchange={handleCoverUpload} accept="image/*" class="hidden" />
        {/if}
      </div>

      <div class="px-8 pb-8">
        <div class="relative -mt-16 mb-8 flex justify-between items-end">
          <div class="relative group z-10">
            <div class="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden flex items-center justify-center">
              {#if formData.avatar}<img src={formData.avatar} alt="Profile" class="w-full h-full object-cover" />{:else}<User class="w-16 h-16 text-gray-500" />{/if}
            </div>
            {#if isEditing}
              <button onclick={() => fileInputRef.click()} class="absolute bottom-0 right-0 w-10 h-10 bg-[#ff6b00] text-black rounded-full flex items-center justify-center hover:bg-[#e57b27] transition-colors shadow-lg cursor-pointer"><Camera class="w-5 h-5" /></button>
            {/if}
            <input type="file" bind:this={fileInputRef} onchange={handleImageUpload} accept="image/*" class="hidden" />
          </div>
          {#if !isEditing}
            <button onclick={() => isEditing = true} class="flex items-center px-4 py-2 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-md text-white rounded-xl border border-gray-700 transition-colors z-10 cursor-pointer"><Edit2 class="w-4 h-4 mr-2" /> Edit Profile</button>
          {/if}
        </div>

        {#if isEditing}
          <form onsubmit={handleSave} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label class="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Full Name</label><input type="text" bind:value={formData.name} required class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="Enter your name" /></div>
              <div><label class="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Email Address</label><input type="email" bind:value={formData.email} required class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="you@example.com" /></div>
              <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Phone Number</label><input type="tel" bind:value={formData.phone} required class="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            
            <div class="space-y-4 pt-4 border-t border-gray-800">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-400 uppercase tracking-wider">Saved Addresses</label>
                <button type="button" onclick={addAddress} class="cursor-pointer flex items-center text-sm text-[#ff6b00] hover:text-[#e57b27] transition-colors"><Plus class="w-4 h-4 mr-1" /> Add Another</button>
              </div>
              {#each formData.addresses as address, index}
                <div class="flex items-center space-x-3">
                  <input type="text" value={address} oninput={(e) => handleAddressChange(index, e.target.value)} required={index === 0} class="flex-1 bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="Hostel Number, Room Number, NIT Silchar" />
                  {#if formData.addresses.length > 1}
                    <button type="button" onclick={() => removeAddress(index)} class="cursor-pointer p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 class="w-5 h-5" /></button>
                  {/if}
                </div>
              {/each}
            </div>

            <div class="pt-6 flex justify-end">
              <button type="submit" class="cursor-pointer flex items-center px-6 py-3 bg-[#ff6b00] hover:bg-[#e57b27] text-black font-bold rounded-xl shadow-[0_0_12px_rgba(229,123,39,0.4)] transition-all"><Save class="w-5 h-5 mr-2" /> Save Profile</button>
            </div>
          </form>
        {:else}
          <div class="space-y-8 mt-4">
            <h1 class="text-3xl font-bold text-white mb-6">{formData.name || 'Unnamed User'}</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex items-start space-x-4"><div class="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center flex-shrink-0"><Mail class="w-5 h-5 text-gray-400" /></div><div><p class="text-sm text-gray-500 uppercase tracking-wider">Email</p><p class="text-white font-medium">{formData.email || 'Not provided'}</p></div></div>
              <div class="flex items-start space-x-4"><div class="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center flex-shrink-0"><Phone class="w-5 h-5 text-gray-400" /></div><div><p class="text-sm text-gray-500 uppercase tracking-wider">Phone</p><p class="text-white font-medium">{formData.phone || 'Not provided'}</p></div></div>
              <div class="flex items-start space-x-4 md:col-span-2">
                <div class="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-1"><MapPin class="w-5 h-5 text-gray-400" /></div>
                <div class="w-full">
                  <p class="text-sm text-gray-500 uppercase tracking-wider mb-2">Saved Addresses</p>
                  {#if formData.addresses.length > 0 && formData.addresses[0] !== ''}
                    <div class="space-y-2">{#each formData.addresses as addr}<div class="bg-gray-800/80 border border-gray-700 rounded-lg p-3 text-white backdrop-blur-md">{addr}</div>{/each}</div>
                  {:else}
                    <p class="text-gray-400 italic">No addresses saved yet.</p>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>