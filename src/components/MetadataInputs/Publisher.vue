<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ ui.metadata_publisher }}</span>
    </div>
    <input type="text" class="form-control" v-model="t_value" />
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
    <div class="metadata-output" :data-xml="xml"></div>
  </div>
</template>

<script>
export default {
  name: "metadata-input-publisher",
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
  },
  computed: {
    xml() {
      let r = "";
      let id = 0;
      for (const item of this.inputs) {
        if (this.id == item.id) {
          break;
        }
        if (item.type == "metadata-input-publisher") id++;
      }
      id = "publisher" + id;
      if (this.t_value != "")
        r +=
          '    <dc:publisher id="' +
          id +
          '">' +
          this.t_value +
          "</dc:publisher>\n";
      if (this.t_file_as != "")
        r +=
          '    <meta property="file-as" refines="#' +
          id +
          '">' +
          this.t_file_as +
          "</meta>\n";
      return r;
    },
  },
};
</script>
<style scoped>
</style>