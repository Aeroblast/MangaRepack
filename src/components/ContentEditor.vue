<template>
  <div id="pageListWarpper" ref="pageList">
    <div
      class="pageListItem"
      v-for="(s, i) in sources"
      :key="s"
      @click="ClickItem(s)"
      :data-select="
        selected == -1
          ? 'no-select'
          : selected == 0
          ? i == 0
            ? 'cover'
            : 'none'
          : selected == i
          ? 'right'
          : i == selected + 1
          ? 'left'
          : 'none'
      "
    >
      <img :src="s.thumbURL" />
      <label class="short_filename"
        ><span>{{ s.filename }}</span></label
      >
      <div class="landmark_label" :data-display="s.landmark ? 'true' : ''">
        <span class="alert-primary" :title="s.landmark">{{ s.landmark }}</span>
      </div>
      <div class="toc_label" :data-display="s.toc ? 'true' : ''">
        <span class="alert-success" :title="s.toc">{{ s.toc }}</span>
      </div>
    </div>
  </div>
  <div id="editorZone">
    <div id="pageViewerWarpper">
      <canvas id="pageViewer" ref="pageViewer"></canvas>
    </div>
    <ul class="nav nav-tabs" id="pageEditor" :data-sp="pageEditorSp">
      <li class="nav-item">
        <a class="nav-link" href="#" v-on:click="AddPlaceholder(0)">{{
          ui.editor_add_placeholder
        }}</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#tocEntryRight"
          id="nav_tocEntryRight"
          >{{ ui.editor_edit_this_page }}</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" v-on:click="AddPlaceholder(1)">{{
          ui.editor_add_placeholder
        }}</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#tocEntryLeft"
          id="nav_tocEntryLeft"
          >{{ ui.editor_edit_this_page }}</a
        >
      </li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane container" id="tocEntryLeft">
        <label>{{ navEditorL_filename }}</label>
        <div class="input-group mb-3 w-50">
          <div class="input-group-prepend">
            <label class="input-group-text alert-primary">{{
              ui.editor_guide
            }}</label>
          </div>
          <select
            class="custom-select"
            v-model="navEditorL_landmark"
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
            v-model="navEditorL_toc"
            onblur="logValueChangeEnd()"
          />
        </div>
        <div class="input-group mb-3">
          <button
            class="btn btn-outline-danger"
            type="button"
            v-on:click="DeletePage(1)"
          >
            {{ ui.editor_delete_page }}
          </button>
        </div>
      </div>
      <div class="tab-pane container" id="tocEntryRight">
        <label>{{ navEditorR_filename }}</label>
        <div class="input-group mb-3 w-50">
          <div class="input-group-prepend">
            <label class="input-group-text alert-primary">{{
              ui.editor_guide
            }}</label>
          </div>
          <select
            class="custom-select"
            v-model="navEditorR_landmark"
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
            v-model="navEditorR_toc"
            onblur="logValueChangeEnd()"
          />
        </div>
        <div class="input-group mb-3">
          <button
            class="btn btn-outline-danger"
            type="button"
            v-on:click="DeletePage(0)"
          >
            {{ ui.editor_delete_page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentEditor",
  props: {
    ui: Object,
    sources: Array,
  },
  emits: [],
  data() {
    return { selected: -1, pageEditorSp: "" };
  },
  mounted() {
    Split(["#pageListWarpper", "#editorZone"], {
      sizes: [30, 70],
    });
    let pv = this.$refs.pageViewer;
    pv.width = window.innerWidth;
    pv.height = (pv.width / 2) * ratio;
  },
  computed: {
    navEditorR_filename() {
      if (this.selected < 0) return undefined;
      return this.sources[this.selected].filename;
    },
    navEditorR_landmark: {
      //first
      get() {
        if (this.selected < 0) return undefined;
        let r = this.sources[this.selected].landmark;
        if (r) return r;
        else return "none";
      },
      set(newValue) {
        if (this.selected < 0) return;
        let src = this.sources[this.selected];
        logValueChange("landmark of ", src, src.landmark, newValue);
        if (newValue == "none") newValue = "";
        src.landmark = newValue;
      },
    },
    navEditorR_toc: {
      get() {
        if (this.selected < 0) return undefined;
        let r = this.sources[this.selected].toc;
        if (r) return r;
        else return "";
      },
      set(newValue) {
        if (this.selected < 0) return;
        let src = this.sources[this.selected];
        logValueChange("toc of ", src, src.toc, newValue);
        src.toc = newValue;
      },
    },
    navEditorL_filename() {
      if (this.selected + 1 >= this.sources.length) return undefined;
      return this.sources[this.selected + 1].filename;
    },
    navEditorL_landmark: {
      get() {
        if (this.selected + 1 >= this.sources.length) return undefined;
        let r = this.sources[this.selected + 1].landmark;
        if (r) return r;
        else return "none";
      },
      set(newValue) {
        if (this.selected + 1 >= this.sources.length) return;
        let src = this.sources[this.selected + 1];
        logValueChange("landmark of ", src, src.landmark, newValue);
        if (newValue == "none") newValue = "";
        src.landmark = newValue;
      },
    },
    navEditorL_toc: {
      //first
      get() {
        if (this.selected + 1 >= this.sources.length) return undefined;
        let r = this.sources[this.selected + 1].toc;
        if (r) return r;
        else return "";
      },
      set(newValue) {
        if (this.selected + 1 >= this.sources.length) return;
        let src = this.sources[this.selected + 1];
        logValueChange("toc of ", src, src.toc, newValue);
        src.toc = newValue;
      },
    },
  },
  methods: {
    ClickItem(e) {
      let index = this.sources.indexOf(e);
      this.ActivePage(index);
    },
    ActivePage(index) {
      if (index == 0) {
        this.selected = 0;
        this.pageEditorSp = "cover";
      } else {
        let r, l; //direction: right to left
        if (index % 2 == 0) {
          l = index;
          r = l - 1;
        } else {
          r = index;
          l = r + 1;
        }
        this.selected = r;
        this.pageEditorSp = "";
        if (r + 1 == this.sources.length) {
          this.pageEditorSp = "single";
        }
      }
      //draw in pageViewer
      let canvas = this.$refs.pageViewer;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (this.selected == 0) {
        //center
        let img = this.sources[0].image;
        let fit = FitImage(img, canvas.width, canvas.height);
        ctx.drawImage(img, fit[0], fit[1], fit[2], fit[3]);
      } else {
        {
          //right
          let img = this.sources[this.selected].image;
          let fit = FitImage(img, canvas.width / 2, canvas.height);
          ctx.drawImage(img, canvas.width / 2, fit[1], fit[2], fit[3]);
        }
        if (this.selected + 1 < this.sources.length) {
          //left
          let img = this.sources[this.selected + 1].image;
          let fit = FitImage(img, canvas.width / 2, canvas.height);
          if (fit[0] > 0) fit[0] = canvas.width / 2 - fit[2];
          ctx.drawImage(img, fit[0], fit[1], fit[2], fit[3]);
        }
      }
      //active page editor
      if (index == 0) {
        document.querySelector("#nav_tocEntryRight").click();
      } else if (index % 2 == 0) {
        document.querySelector("#nav_tocEntryLeft").click();
      } else {
        document.querySelector("#nav_tocEntryRight").click();
      }
    },
    AddPlaceholder(offset) {
      if (this.selected < 0) return;
      if (this.selected + offset >= this.sources.length) return;
      let ph = CreateSourcePlaceholder(
        this.sources[this.selected + offset - 1]
      );
      this.sources.splice(this.selected + offset, 0, ph);
      this.ActivePage(this.selected + offset);
      log("Placeholder inserted.");
    },
    DeletePage(offset) {
      if (this.selected < 0) return;
      if (this.selected + offset >= this.sources.length) return;
      let p = this.sources[this.selected + offset];
      this.sources.splice(this.selected + offset, 1);
      this.ActivePage(this.selected + offset);
      if (p.from == "placeholder") {
        log("Delete placeholder: " + p.filename);
      } else {
        log("Delete page: " + p.filename);
      }
    },
  },
};
</script>


<style src="./ContentEditor.css">
</style>
