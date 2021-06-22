<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_meta }}</span>
    </div>
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_meta_property }}</span>
    </div>
    <input type="text" class="form-control" v-model="t_property" />
    <div class="input-group-prepend">
      <label class="input-group-text">{{ ui.metadata_meta_value }}</label>
    </div>
    <input type="text" class="form-control" v-model="t_value" />
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
  name: "metadata-input-general",
  props: {
    id: Number,
    ui: Object,
  },
  data() {
    return {
      t_value: "",
      t_property: "",
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
      if (this.t_property != "" && this.t_value != "") {
        return (
          '    <meta property="' +
          this.t_property +
          '">' +
          this.t_value +
          "</meta>\n"
        );
      }
    },
  },
};
</script>
<style scoped>
</style>