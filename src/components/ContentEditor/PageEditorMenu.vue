<template>
  <label>{{ filename }}</label>
  <div class="input-group mb-3 w-50">
    <div class="input-group-prepend">
      <label class="input-group-text alert-primary">{{
        ui.editor_guide
      }}</label>
    </div>
    <select
      class="custom-select"
      v-model="landmark"
      onblur="logValueChangeEnd()"
    >
      <option value="none">- - -</option>
      <option value="cover">表紙</option>
      <option value="toc">目次</option>
      <option value="bodymatter">本編</option>
      <option value="colophon">奥付</option>
    </select>
  </div>
  <div class="input-group mb-3 w-50">
    <div class="input-group-prepend">
      <span class="input-group-text alert-success">{{
        ui.editor_toc_entry
      }}</span>
    </div>
    <input
      type="text"
      class="form-control"
      placeholder="- - -"
      v-model="toc"
      onblur="logValueChangeEnd()"
    />
  </div>
  <div class="input-group mb-3">
    <button
      class="btn btn-outline-primay"
      type="button"
      data-toggle="modal"
      data-target="#SVGEditor"
    >
      {{
        source && source.SVGLinks && source.SVGLinks.length > 0
          ? "编辑图形目录"
          : "添加图形目录"
      }}
    </button>
    <button
      class="btn btn-outline-danger"
      type="button"
      @click="$emit('delete', offset)"
    >
      {{ ui.editor_delete_page }}
    </button>
  </div>
</template>
<script>
export default {
  name: "page-editor-menu",
  props: {
    offset: Number,
    source: Object,
    ui: Object,
  },
  emits: ["delete"],
  data() {
    return {};
  },
  methods: {},
  computed: {
    filename() {
      if (this.source) return this.source.filename;
      else return undefined;
    },
    landmark: {
      get() {
        if (!this.source) return undefined;
        let r = this.source.landmark;
        if (r) return r;
        else return "none";
      },
      set(newValue) {
        if (!this.source) return;
        logValueChange(
          "landmark of ",
          this.source,
          this.source.landmark,
          newValue
        );
        if (newValue == "none") newValue = "";
        this.source.landmark = newValue;
      },
    },
    toc: {
      get() {
        if (!this.source) return undefined;
        let r = this.source.toc;
        if (r) return r;
        else return "";
      },
      set(newValue) {
        if (!this.source) return;
        logValueChange("landmark of ", this.source, this.source.toc, newValue);
        if (newValue == "none") newValue = "";
        this.source.toc = newValue;
      },
    },
  },
};
</script>