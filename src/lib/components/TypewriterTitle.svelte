<script>
  let initialPhrase = "Welcome To ML Club Store";
  let phrasePool = [
    "ready to gear up coder?", "time to buy some stuffs", "compile. run. wear.", 
    "upgrade your inventory", "git commit -m 'new outfit'", "ctrl+c this style", 
    "sudo apt-get upgrade closet", "debug in style"
  ];

  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

  let currentPhrase = $state(initialPhrase);
  let availablePhrases = $state([]);
  let subIndex = $state(0);
  let isDeleting = $state(false);
  let blink = $state(true);

  // Blinking cursor loop
  $effect(() => {
    const interval = setInterval(() => blink = !blink, 500);
    return () => clearInterval(interval);
  });

  // Typing effect loop
  $effect(() => {
    if (subIndex === currentPhrase.length && !isDeleting) {
      const timeout = setTimeout(() => isDeleting = true, 3000);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && isDeleting) {
      isDeleting = false;
      let nextAvail = [...availablePhrases];
      if (nextAvail.length === 0) nextAvail = shuffle(phrasePool);
      currentPhrase = nextAvail.pop();
      availablePhrases = nextAvail;
      return;
    }
    const timeout = setTimeout(() => {
      subIndex += isDeleting ? -1 : 1;
    }, isDeleting ? 30 : 80);
    return () => clearTimeout(timeout);
  });
</script>

<h1 class="text-[11px] min-[375px]:text-xs sm:text-base md:text-xl lg:text-2xl font-mono font-bold text-white tracking-normal sm:tracking-widest uppercase leading-snug break-words">
  {currentPhrase.substring(0, subIndex)}<span class={`text-[#ff6b00] font-bold transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}>_</span>
</h1>