<script setup>
import logo from '~/assets/css/image/logo.svg';

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

const title = 'PackSmith - Modpack update checker';
const description = 'Keep your Minecraft modpacks up-to-date with PackSmith, the ultimate modpack update checker. Easily track and manage updates for all your mods in one place.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: logo,
  twitterImage: logo,
  twitterCard: 'summary_large_image',
});
</script>

<template>
    <UApp>
        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
