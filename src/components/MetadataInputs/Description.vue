<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_description }}</span>
    </div>
    <textarea
      class="form-control"
      ref="input0"
      @blur="Validate"
      v-model="t_value"
    ></textarea>
    <div class="input-group-append">
      <button class="btn btn-outline-danger" type="button" v-on:click="Destory">
        {{ ui.metadata_delete }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "metadata-input-description",
  props: {
    id: Number,
    ui: Object,
  },
  data() {
    return {
      t_value: "",
    };
  },
  methods: {
    Destory() {
      console.log(this.xml);
      this.$emit("destory", this.id);
    },
    Validate() {
      if (this.t_value.trim() == "") {
        this.$refs.input0.classList.add("is-invalid");
        return false;
      }
      this.$refs.input0.classList.remove("is-invalid");
      return true;
    },
  },
  computed: {
    xml() {
      let r = "";
      if (this.t_value != "")
        r += "    <dc:description>" + this.t_value + "</dc:description>\n";
      return r;
    },
  },
};
</script>
<style scoped>
</style>