<template>
  <div id="main">
    <ul class="nav nav-tabs">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">{{
          ui.menu_file
        }}</a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" v-on:click="ImportZip">{{
            ui.menu_import
          }}</a>
          <a class="dropdown-item" href="#" v-on:click="Save">{{
            ui.menu_save
          }}</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#settings">{{
          ui.nav_settings
        }}</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          id="nav_content"
          data-toggle="tab"
          href="#content_editor"
          >{{ ui.nav_content }}</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          id="nav_metadata_editor"
          data-toggle="tab"
          href="#metadata_editor"
          >{{ ui.nav_metadata }}</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          id="nav_preview"
          data-toggle="tab"
          href="#preview"
          >{{ ui.nav_preview }}</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#about">{{
          ui.nav_about
        }}</a>
      </li>
      <li id="log" onclick="ToggleLog()">
        <component
          v-for="msg in log"
          v-bind:is="msg.type"
          :class="'alert alert-' + msg.bsClass"
          :time="msg.time"
          :key="msg.id"
          :logVar="logVar"
          :title="msg.content"
        >
          {{ msg.content }}
        </component>
      </li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane container active" id="settings">
        <Settings
          :ui="ui"
          v-model:sort="settings_sort"
          v-model:zip-encoding="settings_zip_encoding"
          @change-lang="ui = $event"
        ></Settings>
      </div>
      <div class="tab-pane container fade" id="content_editor">
        <ContentEditor :ui="ui" :sources="sources"></ContentEditor>
      </div>
      <div class="tab-pane container fade" id="metadata_editor">
        <MetadataEditor ref="metadataEditor" :ui="ui"></MetadataEditor>
      </div>
      <div class="tab-pane container fade" id="preview">
        <Preview :ui="ui" :sources="sources" @save="Save"></Preview>
      </div>
      <div class="tab-pane container fade" id="about">
        <h2>Manga Repack</h2>
        <p>{{ ui.about_content }}</p>
      </div>
    </div>
  </div>
  <input
    ref="fileInput"
    type="file"
    accept=".zip,.jpg,.jpeg,.png"
    multiple
    style="display: none"
  />
</template>

<script>
import LogMessage from "./components/LogMessage.vue";
import LogMessageVar from "./components/LogMessageVar.vue";
import Settings from "./components/Settings.vue";
import ContentEditor from "./components/ContentEditor.vue";
import MetadataEditor from "./components/MetadataEditor.vue";
import Preview from "./components/Preview.vue";

import { locale_zhCN, locale_en, GetUserLocale } from "./locale.js";
import { SaveEpub, MapSourceName, MapLandmark } from "./save-epub";
export default {
  name: "App",
  components: {
    LogMessage,
    LogMessageVar,
    Settings,
    ContentEditor,
    MetadataEditor,
    Preview,
  },
  data() {
    return {
      ui: GetUserLocale(),
      log: [],
      logVar: "",
      sources: [],
      source_commonPath: "",
      settings_sort: "SortByFullPath",
      settings_zip_encoding: "shift-jis",
    };
  },
  computed: {},
  mounted() {
    vm = this; //for public content
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.$refs.fileInput.onchange = function () {
      document.body.setAttribute("data-state", "loading");
      ProcInputFiles(vm.$refs.fileInput.files).then(() => {
        document.body.setAttribute("data-state", "");
        log(vm.ui.msg_imported, "success");
      });
    };
  },
  methods: {
    ImportZip() {
      this.$refs.fileInput.click();
      document.querySelector("#nav_content").click();
    },
    Save() {
      if (this.sources.length == 0) {
        log("No content!", "danger");
        return;
      }
      if (!this.$refs.metadataEditor.ValidateAll()) {
        document.querySelector("#nav_metadata_editor").click();
        log("metadata not complete!", "danger");
        return;
      }
      document.querySelector("#nav_preview").click();
      SaveEpub();
    },
  },
};

async function ProcInputFiles(files) {
  for (const f of files) {
    logValueChange("input count", null, 0, vm.sources.length + "");
    if (f.name.endsWith(".zip")) {
      const reader = new zip.ZipReader(new zip.BlobReader(f), {
        filenameEncoding: vm.settings_zip_encoding,
      });
      const entries = await reader.getEntries();
      for (const entry of entries) {
        if (entry.filename.endsWith(".jpg")) {
          const blob = await entry.getData(new zip.BlobWriter("image/jpeg"));
          vm.sources.push(
            await CreateSource(blob, f.name + "/" + entry.filename, "archive")
          );
        }
        if (entry.filename.endsWith(".png")) {
          const blob = await entry.getData(new zip.BlobWriter("image/png"));
          vm.sources.push(
            await CreateSource(blob, f.name + "/" + entry.filename, "archive")
          );
        }
        logValueChange("input count", null, 0, vm.sources.length + "");
      }
      await reader.close();
    }
    if (f.name.endsWith(".jpg") || f.name.endsWith(".png")) {
      vm.sources.push(await CreateSource(f, f.name, "file"));
    }
  }
  if (vm.sources.length == 0) return;
  let common = vm.sources[0].filename;
  for (const src of vm.sources) {
    common = StringCommonStart(common, src.filename);
  }
  vm.sources[0].toc = MapLandmark("cover", vm.$refs.metadataEditor.language);
  vm.sources[0].landmark = "cover";

  vm.source_commonPath = common;
  if (vm.$refs.metadataEditor.title == "")
    vm.$refs.metadataEditor.title = common
      .replaceAll("/", " ")
      .replace(".zip", "");
  vm.sources.sort(sortSourceByFullPath);
  MapSourceName();
  logValueChange("input count", null, 0, vm.sources.length + "");
  logValueChangeEnd();
}
</script>

<style>
#log {
  right: 0;
  top: 0;
  width: 40%;
  height: 2.5em;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-left: auto;
  margin-right: 0.5em;
  scroll-behavior: smooth;
}

#log[data-enlarge] {
  height: 10em;
  position: absolute;
}

#log::-webkit-scrollbar {
  display: none;
}

#log > p {
  line-height: 1.3em;
  font-size: 1em;
  margin: 0;
  padding: 0.5em 0.5em;
  white-space: nowrap;
  overflow: hidden;
}
</style>
