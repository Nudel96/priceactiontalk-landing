<script lang="ts">
  export let testimonials = [
    {
      name: "Adeel Q.",
      country: "Pakistan",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Place your avatars in /static or use avatar generator URLs
      quote:
        "PriceActionTalk is the first community where I truly learned about market psychology and real trading. No hype – real growth."
    },
    {
      name: "Sophia L.",
      country: "Germany",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      quote:
        "Finally a level system that makes sense. You see who actually has skill – and you get real feedback. Top!"
    },
    {
      name: "Rajesh S.",
      country: "India",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      quote:
        "The tasks and community help me stay disciplined. Now I really understand macro and liquidity zones. Great value."
    }
  ];
</script>

<div class="max-w-7xl mx-auto">
  <h2 class="text-3xl md:text-4xl font-bold text-center text-[#7cfc00] mb-12">What our members say</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each testimonials as t}
      <div class="bg-[#101d2b] border border-[#1b9aaa]/20 rounded-[8px] p-8 flex flex-col items-center shadow hover:shadow-xl transition">
        <img src={t.avatar} alt={t.name} class="w-16 h-16 rounded-full mb-4 border border-[#1b9aaa]/30 object-cover" />
        <p class="text-base text-[#b0bec5] mb-5 text-center">"{t.quote}"</p>
        <div class="font-semibold text-white">{t.name} <span class="text-xs text-[#1b9aaa] ml-2">{t.country}</span></div>
      </div>
    {/each}
  </div>
</div>
