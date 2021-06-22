<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_creator }}</span>
    </div>
    <input
      type="text"
      class="form-control"
      ref="input0"
      @blur="Validate"
      v-model="t_value"
    />
    <div class="input-group-prepend">
      <label
        class="input-group-text"
        data-toggle="tooltip"
        v-bind:title="ui.metadata_file_as_tip"
        >{{ ui.metadata_file_as }}
      </label>
    </div>
    <input type="text" class="form-control" v-model="t_file_as" />
    <div class="input-group-append">
      <button class="btn btn-outline-danger" type="button" v-on:click="Destory">
        {{ ui.metadata_delete }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "metadata-input-creator",
  props: {
    id: Number,
    ui: Object,
    inputs: Array,
  },
  data() {
    return {
      t_value: "",
      t_file_as: "",
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
      let id = 0;
      for (const item of this.inputs) {
        if (this.id == item.id) {
          break;
        }
        if (item.type == "metadata-input-creator") id++;
      }
      id = "creator" + id;
      if (this.t_value.trim() != "")
        r +=
          '    <dc:creator id="' +
          id +
          '">' +
          this.t_value.trim() +
          "</dc:creator>\n";
      if (this.t_file_as.trim() != "")
        r +=
          '    <meta property="file-as" refines="#' +
          id +
          '">' +
          this.t_file_as.trim() +
          "</meta>\n";
      return r;
    },
  },
};
</script>
<style scoped>
</style>