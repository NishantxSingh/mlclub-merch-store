<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const initialPhrase: string = "Welcome To ML Club Store";
  const phrasePool: string[] = [
    "ready to gear up coder?", "time to buy some stuffs", "compile. run. wear.",
    "upgrade your inventory", "git commit -m 'new outfit'", "ctrl+c this style",
    "sudo apt-get upgrade closet", "debug in style"
  ];

  function shuffle(arr: string[]): string[] { return [...arr].sort(() => Math.random() - 0.5); }

  let currentPhrase: string = initialPhrase;
  let availablePhrases: string[] = shuffle(phrasePool.slice());
  let subIndex: number = 0;
  let isDeleting: boolean = false;
  let blink: boolean = true;

  let blinkInterval: ReturnType<typeof setInterval> | null = null;
  let typingTimeout: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    blinkInterval = setInterval(() => blink = !blink, 500);
    scheduleTyping();
  });

  onDestroy(() => {
    if (blinkInterval) clearInterval(blinkInterval);
    if (typingTimeout) clearTimeout(typingTimeout);
  });

  function scheduleTyping() {
    if (typingTimeout) clearTimeout(typingTimeout);

    if (subIndex === currentPhrase.length && !isDeleting) {
      typingTimeout = setTimeout(() => { isDeleting = true; scheduleTyping(); }, 3000);
      return;
    }

    if (subIndex === 0 && isDeleting) {
      isDeleting = false;
      let nextAvail = [...availablePhrases];
      if (nextAvail.length === 0) nextAvail = shuffle(phrasePool.slice());
      currentPhrase = (nextAvail.pop() as string) || initialPhrase;
      availablePhrases = nextAvail;
      // continue typing the new phrase
      typingTimeout = setTimeout(() => { subIndex += 1; scheduleTyping(); }, 80);
      return;
    }

    typingTimeout = setTimeout(() => {
      subIndex += isDeleting ? -1 : 1;
      scheduleTyping();
    }, isDeleting ? 30 : 80);
  }
</script>

<h1 class="text-[11px] min-[375px]:text-xs sm:text-base md:text-xl lg:text-2xl font-mono font-bold text-white tracking-normal sm:tracking-widest uppercase leading-snug wrap-break-word">
  {currentPhrase.substring(0, subIndex)}<span class={`text-[#ff6b00] font-bold transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`}>_</span>
</h1>