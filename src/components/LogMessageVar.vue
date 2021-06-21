<template>
<p>{{time}}: <slot></slot> {{logVar}}</p>
</template>

<script>
export default {
  name: "LogMessageVar",
  props: {
    id: Number,
    time: String,
    logVar:String
  },
};
</script>


<style scoped>
</style>
