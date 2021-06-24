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
        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
          <ruby>{{ ui.editor_insert }}<rt>^</rt></ruby>
        </a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" v-on:click="AddPlaceholder(0)">{{
            ui.editor_placeholder
          }}</a>
          <a class="dropdown-item" href="#">暂存</a>
        </div>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#tocEntryRight"
          id="nav_tocEntryRight"
          @click="selectOffset = 0"
          >{{ ui.editor_edit_this_page }}</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
          <ruby>{{ ui.editor_insert }}<rt>^</rt></ruby>
        </a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" v-on:click="AddPlaceholder(1)">{{
            ui.editor_placeholder
          }}</a>
          <a class="dropdown-item" href="#">暂存</a>
        </div>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="tab"
          href="#tocEntryLeft"
          id="nav_tocEntryLeft"
          @click="selectOffset = 1"
          >{{ ui.editor_edit_this_page }}</a
        >
      </li>
    </ul>
    <!-------上面是菜单--------->
    <div class="tab-content">
      <div class="tab-pane container" id="tocEntryLeft">
        <PageEditorMenu
          ref="pageEditorL"
          :ui="ui"
          :offset="1"
          :source="selectedSourceL"
          @delete="DeletePage($event)"
        ></PageEditorMenu>
      </div>
      <!-------左右分割线--------->
      <div class="tab-pane container" id="tocEntryRight">
        <PageEditorMenu
          ref="pageEditorR"
          :ui="ui"
          :offset="0"
          :source="selectedSourceR"
          @delete="DeletePage($event)"
        ></PageEditorMenu>
      </div>
    </div>
  </div>
  <div class="modal" id="SVGEditor">
    <div>
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">SVG Editor</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <div class="modal-body">
          <SVGLinkEditor :ui="ui" :source="selectedSource"></SVGLinkEditor>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal">
            Save
          </button>
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SVGLinkEditor from "./ContentEditor/SVGLinkEditor.vue";
import PageEditorMenu from "./ContentEditor/PageEditorMenu.vue";
export default {
  name: "ContentEditor",
  props: {
    ui: Object,
    sources: Array,
  },
  components: {
    SVGLinkEditor,
    PageEditorMenu,
  },
  emits: [],
  data() {
    return {
      selected: -1,
      pageEditorSp: "",
      selectOffset: 0,
    };
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
    selectedSourceR() {
      if (this.selected < 0) return undefined;
      return this.sources[this.selected];
    },
    selectedSourceL() {
      if (this.selected + 1 >= this.sources.length) return undefined;
      return this.sources[this.selected + 1];
    },
    selectedSource() {
      if (this.selectOffset == 0) {
        return this.selectedSourceR;
      } else {
        return this.selectedSourceL;
      }
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