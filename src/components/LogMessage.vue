<template>
<p>{{time}}: <slot></slot></p>
</template>

<script>
export default {
  name: "LogMessage",
  props: {
    id: Number,
    time: String,
  },
};
</script>
<style scoped>
</style>