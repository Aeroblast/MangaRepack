<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <label class="input-group-text">{{ ui.metadata_date }}</label>
    </div>
    <input type="date" v-model="t_value" />
    <div class="input-group-append">
      <button class="btn btn-outline-danger" type="button" v-on:click="Destory">
        {{ ui.metadata_delete }}
      </button>
    </div>
    <div class="metadata-output" v-bind:data-xml="xml"></div>
  </div>
</template>

<script>
export default {
  name: "metadata-input-date",
  props: {
    id: Number,
    ui: Object,
  },
  data() {
    return {
      t_value: new Date().toISOString(),
    };
  },
  methods: {
    Destory() {
      console.log(this.xml);
      this.$emit("destory", this.id);
    },
  },
  computed: {
    xml() {
      let r = "";
      if (this.t_value != "")
        r += "    <dc:date>" + this.t_value + "</dc:date>\n";
      return r;
    },
  },
};
</script>
<style scoped>
</style>