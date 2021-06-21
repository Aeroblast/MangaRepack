<template>
  <form class="p-3">
    <div class="input-group mb-3 w-25">
      <div class="input-group-prepend">
        <label class="input-group-text" for="metadata_language">{{
          ui.metadata_language
        }}</label>
      </div>
      <select class="custom-select" id="metadata_language" v-model="language">
        <option>ja</option>
        <option>zh-CN</option>
        <option>zh-TW</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">{{
          ui.metadata_title
        }}</span>
      </div>
      <input type="text" class="form-control" placeholder="" v-model="title" />
      <div class="input-group-prepend">
        <label
          class="input-group-text"
          for="file-as"
          data-toggle="tooltip"
          v-bind:title="ui.metadata_file_as_tip"
          >{{ ui.metadata_file_as }}</label
        >
      </div>
      <input type="text" class="form-control" v-model="title_file_as" />
    </div>
    <div class="nav-item dropdown mb-3">
      <button
        type="button"
        class="btn btn-primary dropdown-toggle"
        data-toggle="dropdown"
      >
        {{ ui.metadata_add_optional }}
      </button>
      <div class="dropdown-menu">
        <a
          class="dropdown-item"
          href="#"
          v-on:click="AddMetadataInput('metadata-input-creator')"
          >{{ ui.metadata_creator }}</a
        >
        <a
          class="dropdown-item"
          href="#"
          v-on:click="AddMetadataInput('metadata-input-date')"
          data-toggle="tooltip"
          data-placement="right"
          :title="ui.metadata_onlyone"
          :data-dropdown-item-disable="containsDate"
          >{{ ui.metadata_date }}</a
        >
        <a
          class="dropdown-item"
          href="#"
          v-on:click="AddMetadataInput('metadata-input-publisher')"
          >{{ ui.metadata_publisher }}</a
        >
        <a
          class="dropdown-item"
          href="#"
          v-on:click="AddMetadataInput('metadata-input-source')"
          >{{ ui.metadata_source }}</a
        >
        <a
          class="dropdown-item"
          href="#"
          v-on:click="AddMetadataInput('metadata-input-general')"
          >{{ ui.metadata_meta }}</a
        >
      </div>
    </div>
    <div id="metadata_editor_optional">
      <component
        v-for="input in inputs"
        v-bind:is="input.type"
        :ui="ui"
        :id="input.id"
        :key="input.id"
        :inputs="inputs"
        @destory="DestoryMetadataInput($event)"
      ></component>
    </div>
  </form>
</template>

<script>
import MetadataInputCreator from "./MetadataInputs/Creator.vue";

export default {
  name: "MetadataEditor",
  components: { MetadataInputCreator },
  props: {
    ui: Object,
  },
  emits: [],
  data() {
    return {
      title: "",
      title_file_as: "",
      language: "ja",
      inputs: [],
    };
  },
  mounted() {},
  computed: {
    containsDate() {
      for (const item of this.inputs) {
        if (item.type == "metadata-input-date") return true;
      }
      console.log("contains date false");
      return false;
    },
  },
  methods: {
    AddMetadataInput(type) {
      if (type == "metadata-input-date") {
        if (this.metadataContainsDate) {
          return;
        }
      }

      this.inputs.push({ id: GenarateId(), type: type });
      console.log(this.inputs);
    },
    DestoryMetadataInput(id) {
      let i = 0;
      for (const item of this.inputs) {
        if (id == item.id) {
          break;
        }
        i++;
      }
      if (i < this.inputs.length) {
        this.inputs.splice(i, 1);
      }
    },
    GetMetadataXml() {
      let optional = document.getElementById("metadata_editor_optional");
      let r = '    <dc:title id="title">' + this.title + "</dc:title>\n";
      if (this.title_file_as != "")
        r +=
          '    <meta property="file-as" refines="#title">' +
          this.title_file_as +
          "</meta>\n";
      r += "    <dc:language>" + this.language + "</dc:language>\n";
      for (const output of optional.getElementsByClassName("metadata-output")) {
        r += output.getAttribute("data-xml");
      }
      return r;
    },
  },
};
</script>


<style scoped>
</style>
