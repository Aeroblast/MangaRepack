<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_meta }}</span>
    </div>
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_meta_property }}</span>
    </div>
    <input
      type="text"
      class="form-control"
      ref="input0"
      @blur="Validate"
      v-model="t_property"
    />
    <div class="input-group-prepend">
      <label class="input-group-text">{{ ui.metadata_meta_value }}</label>
    </div>
    <input
      type="text"
      class="form-control"
      ref="input1"
      @blur="Validate"
      v-model="t_value"
    />
    <div class="input-group-append">
      <button class="btn btn-outline-danger" type="button" v-on:click="Destory">
        {{ ui.metadata_delete }}
      </button>
    </div>
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
    Validate() {
      let r = true;
      if (this.t_value.trim() == "") {
        this.$refs.input1.classList.add("is-invalid");
        r = false;
      } else {
        this.$refs.input1.classList.remove("is-invalid");
      }
      if (this.t_property.trim() == "") {
        this.$refs.input0.classList.add("is-invalid");
        r = false;
      } else {
        this.$refs.input0.classList.remove("is-invalid");
      }
      return r;
    },
  },
  computed: {
    xml() {
      if (this.t_property.trim() != "" && this.t_value.trim() != "") {
        return (
          '    <meta property="' +
          this.t_property.trim() +
          '">' +
          this.t_value.trim() +
          "</meta>\n"
        );
      }
    },
  },
};
</script>
<style scoped>
</style>