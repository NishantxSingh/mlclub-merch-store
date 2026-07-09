<script lang="ts">
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { 
    onAuthStateChanged, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
  } from 'firebase/auth';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { Home, User, MapPin, Phone, Mail, Camera, Save, Plus, Trash2, Lock, LogIn, AlertCircle } from '@lucide/svelte';

  // --- UI & State ---
  let loading = $state(true);
  let isEditing = $state(false);
  let currentUser = $state<any>(null);

  // --- Auth State ---
  let authEmail = $state('');
  let authPassword = $state('');
  let isSignupMode = $state(false);
  let authError = $state('');
  let isAuthLoading = $state(false);

  // --- Profile State ---
  let formData = $state({
    name: '',
    email: '',
    phone: '',
    addresses: [''],
    avatar: '',
    cover: ''
  });

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      
      if (user) {
        // Fetch profile from Firestore
        const docRef = doc(db, 'profiles', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            formData = {
              name: data.name || '',
              email: user.email || data.email || '',
              phone: data.phone || '',
              addresses: data.addresses?.length ? data.addresses : [''],
              avatar: data.avatar || '',
              cover: data.cover || ''
            };
            isEditing = false;
          } else {
            // New user: Pre-fill email and force them to edit profile
            formData.email = user.email || '';
            isEditing = true;
          }
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
      loading = false;
    });

    return () => unsubscribe();
  });

  // --- Authentication Handlers ---
  const googleProvider = new GoogleAuthProvider();

  // Demo credentials for local testing
  const DEMO_EMAIL = 'demo+user@test.local';
  const DEMO_PASSWORD = 'Password123!';

  async function handleGoogleLogin() {
    try {
      authError = '';
      isAuthLoading = true;
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      authError = err.message || 'Failed to login with Google.';
    } finally {
      isAuthLoading = false;
    }
  }

  async function handleEmailAuth(e: Event) {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      authError = 'Please enter both email and password.';
      return;
    }

    try {
      authError = '';
      isAuthLoading = true;
      if (isSignupMode) {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      authError = err.message || 'Authentication failed.';
    } finally {
      isAuthLoading = false;
    }
  }

  // Prefill and attempt demo account sign-in (create account if missing)
  async function handleUseDemo() {
    authError = '';
    isAuthLoading = true;
    authEmail = DEMO_EMAIL;
    authPassword = DEMO_PASSWORD;
    try {
      // Try signing in first
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
    } catch (err: any) {
      // If user not found, create one for local testing
      if (err?.code === 'auth/user-not-found' || /user-not-found/.test(err?.message || '')) {
        try {
          await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        } catch (createErr: any) {
          authError = createErr.message || 'Failed to create demo account.';
        }
      } else {
        authError = err.message || 'Demo sign-in failed.';
      }
    } finally {
      isAuthLoading = false;
    }
  }

  async function handleLogout() {
    await signOut(auth);
    // Reset forms
    authEmail = '';
    authPassword = '';
    formData = { name: '', email: '', phone: '', addresses: [''], avatar: '', cover: '' };
  }

  // --- Profile Handlers ---
  async function handleSaveProfile() {
    if (!currentUser) return;
    try {
      loading = true;
      const docRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(docRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addresses: formData.addresses.filter(addr => addr.trim() !== ''),
        avatar: formData.avatar,
        cover: formData.cover,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      isEditing = false;
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile changes.");
    } finally {
      loading = false;
    }
  }

  function handleImageUpload(e: Event, type: 'avatar' | 'cover') {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'avatar') formData.avatar = reader.result as string;
        if (type === 'cover') formData.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<div class="min-h-screen bg-black text-gray-100 font-sans pt-24 pb-12 px-4 sm:px-6 relative selection:bg-[#ff6b00] selection:text-black z-10">
  
  {#if loading}
    <div class="flex items-center justify-center h-[60vh]">
      <div class="w-12 h-12 border-4 border-gray-800 border-t-[#ff6b00] rounded-full animate-spin"></div>
    </div>

  {:else if !currentUser}
    <div class="max-w-md mx-auto relative group mt-10">
      <div class="absolute -inset-1 bg-linear-to-r from-[#ff6b00] to-[#ff8c00] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative bg-[#0a0a0a] border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
        
        <div class="text-center mb-8">
          <h2 class="text-3xl font-black text-white mb-2 font-mono uppercase tracking-wider">Welcome Back</h2>
          <p class="text-gray-400 text-sm">Access your ML Club inventory.</p>
        </div>

        {#if authError}
          <div class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-start gap-2">
            <AlertCircle class="w-5 h-5 shrink-0" />
            <p>{authError}</p>
          </div>
        {/if}

        <button 
          onclick={handleGoogleLogin} 
          disabled={isAuthLoading}
          class="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-xl hover:bg-gray-200 transition-all mb-6 disabled:opacity-50"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div class="flex items-center mb-6">
          <div class="grow h-px bg-gray-800"></div>
          <span class="px-4 text-xs text-gray-500 font-mono uppercase">or email</span>
          <div class="grow h-px bg-gray-800"></div>
        </div>

        <form onsubmit={handleEmailAuth} class="space-y-4">
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="email" 
              bind:value={authEmail}
              placeholder="Email Address" 
              class="w-full bg-black/50 border border-gray-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#ff6b00] transition-colors"
              required
            />
          </div>
          
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="password" 
              bind:value={authPassword}
              placeholder="Password" 
              class="w-full bg-black/50 border border-gray-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#ff6b00] transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isAuthLoading}
            class="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#ff6b00] to-[#ff8c00] text-black font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all uppercase tracking-wide disabled:opacity-50 mt-2"
          >
            {#if isAuthLoading}
               Processing...
            {:else}
              <LogIn class="w-5 h-5" />
              {isSignupMode ? 'Create Account' : 'Sign In'}
            {/if}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button 
            type="button"
            onclick={() => isSignupMode = !isSignupMode} 
            class="text-sm text-gray-400 hover:text-[#ff6b00] transition-colors"
          >
            {isSignupMode ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>

  {:else}
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800">
        <div class="h-48 sm:h-64 bg-linear-to-r from-gray-800 to-black relative">
          {#if formData.cover}
            <img src={formData.cover} alt="Cover" class="w-full h-full object-cover opacity-60" />
          {/if}
          {#if isEditing}
            <label class="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/60 transition-all group">
              <input type="file" accept="image/*" onchange={(e) => handleImageUpload(e, 'cover')} class="hidden" />
              <div class="bg-black/50 p-3 rounded-full text-white group-hover:text-[#ff6b00] transition-colors">
                <Camera class="w-6 h-6" />
              </div>
            </label>
          {/if}
        </div>

        <div class="px-6 sm:px-10 pb-8 relative flex flex-col sm:flex-row items-center sm:items-end sm:-mt-16 gap-6">
          <div class="relative -mt-20 sm:mt-0 w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gray-800 shadow-xl shrink-0">
            {#if formData.avatar}
              <img src={formData.avatar} alt="Avatar" class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center bg-gray-800 text-[#ff6b00]">
                <User class="w-12 h-12" />
              </div>
            {/if}
            {#if isEditing}
              <label class="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer hover:bg-black/80 transition-all group">
                <input type="file" accept="image/*" onchange={(e) => handleImageUpload(e, 'avatar')} class="hidden" />
                <Camera class="w-6 h-6 text-white group-hover:text-[#ff6b00]" />
              </label>
            {/if}
          </div>
          
          <div class="grow text-center sm:text-left">
            <h1 class="text-3xl font-black text-white">{formData.name || 'Set Your Name'}</h1>
            <p class="text-[#ff6b00] font-mono text-sm">{currentUser.email}</p>
          </div>

          <div class="flex gap-3">
            {#if !isEditing}
              <button onclick={() => isEditing = true} class="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-all font-bold">
                Edit Profile
              </button>
              <button onclick={handleLogout} class="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all font-bold">
                Logout
              </button>
            {:else}
              <button onclick={handleSaveProfile} class="flex items-center gap-2 px-6 py-2 bg-[#ff6b00] hover:bg-[#e57b27] text-black rounded-xl font-bold transition-all shadow-lg">
                <Save class="w-4 h-4" /> Save
              </button>
              <button onclick={() => isEditing = false} class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all font-bold">
                Cancel
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User class="w-5 h-5 text-[#ff6b00]" /> Personal Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <div class="text-sm font-mono text-gray-500 uppercase">Full Name</div>
            {#if isEditing}
              <input type="text" bind:value={formData.name} class="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-[#ff6b00] outline-none" />
            {:else}
              <div class="bg-white/5 border border-white/5 rounded-xl p-3 text-white">{formData.name || '—'}</div>
            {/if}
          </div>

          <div class="space-y-2">
            <div class="text-sm font-mono text-gray-500 uppercase">Phone Number</div>
            {#if isEditing}
              <input type="tel" bind:value={formData.phone} class="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-[#ff6b00] outline-none" />
            {:else}
              <div class="bg-white/5 border border-white/5 rounded-xl p-3 text-white">{formData.phone || '—'}</div>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 sm:p-10 backdrop-blur-xl mb-20">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <MapPin class="w-5 h-5 text-[#ff6b00]" /> Saved Addresses
          </h2>
          {#if isEditing}
            <button onclick={() => formData.addresses.push('')} class="p-2 bg-white/10 hover:bg-[#ff6b00]/20 hover:text-[#ff6b00] text-gray-300 rounded-lg transition-colors">
              <Plus class="w-5 h-5" />
            </button>
          {/if}
        </div>

        <div class="space-y-4">
          {#each formData.addresses as address, i}
            <div class="flex gap-3 items-start">
              {#if isEditing}
                <textarea 
                  bind:value={formData.addresses[i]} 
                  rows="2" 
                  placeholder="Enter your shipping address..."
                  class="w-full bg-black border border-gray-800 rounded-xl p-3 text-white focus:border-[#ff6b00] outline-none resize-none"
                ></textarea>
                <button onclick={() => formData.addresses.splice(i, 1)} class="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors border border-red-500/20">
                  <Trash2 class="w-5 h-5" />
                </button>
              {:else}
                <div class="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white/80 leading-relaxed">
                  {address || 'No address saved.'}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      
    </div>
  {/if}
</div>