<template>
  <form class="p-3">
    <div class="form-group row">
      <label class="col-form-label col-3">Language</label>
      <select class="form-control col-3" v-model="lang">
        <option value="zh-CN">简体中文</option>
        <option value="en">English</option>
      </select>
    </div>
    <div class="form-group row">
      <label for="settings_zip_encoding" class="col-form-label col-3">{{
        ui.settings_zip_encoding
      }}</label>
      <select
        class="form-control col-3"
        id="settings_zip_encoding"
        :value="zipEncoding"
        @input="$emit('update:zipEncoding', $event.target.value)"
      >
        <option>utf-8</option>
        <option>shift-jis</option>
        <option>gbk</option>
        <option>big5</option>
        <!-- https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings -->
      </select>
    </div>
    <div class="form-group row">
      <label for="settings_sort" class="col-form-label col-3">{{
        ui.settings_sort
      }}</label>
      <select
        class="form-control col-3"
        id="settings_sort"
        :value="sort"
        @input="$emit('update:sort', $event.target.value)"
      >
        <option value="SortByFullPath">{{ ui.settings_SortByFullPath }}</option>
        <option value="SortByFileName">{{ ui.settings_SortByFileName }}</option>
      </select>
    </div>
  </form>
</template>

<script>
export default {
  name: "Settings",
  props: {
    ui: Object,
    sort: String,
    zipEncoding: String,
  },
  emits: ["changeLang", "update:zipEncoding", "update:sort"],
  data() {
    return {};
  },
  computed: {
    lang: {
      get() {
        if (this.ui.nav_settings == locale_zhCN.nav_settings) return "zh-CN";
        if (this.ui.nav_settings == locale_en.nav_settings) return "en";
      },
      set(newValue) {
        let v = locale_en;
        switch (newValue) {
          case "zh-CN":
            v = locale_zhCN;
            break;
          case "en":
            break;
        }
        this.$emit("changeLang", v);
      },
    },
  },
};
</script>


<style scoped>
</style>
