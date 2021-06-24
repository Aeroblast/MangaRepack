<template>
  <div id="svg_display">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :viewBox="'0 0 ' + width + ' ' + height"
      @mouseup="MouseUp($event)"
      @mousemove="MouseMove"
    >
      <image
        ref="svg"
        :width="width"
        :height="height"
        :xlink:href="imageDateURL"
      />
      <component
        v-for="link in links"
        v-bind:is="'Editable' + link.type"
        :key="link.id"
        :id="link.id"
        :linkInfoRef="link"
        @edit="StartEdit($event)"
        @init="InitEditable($event)"
      ></component>
    </svg>
  </div>
  <div id="svg_editor">
    <label>源文件：{{ source ? source.filename : "" }}</label>
    <div class="input-grpup">
      <button class="btn dropdown-toggle" data-toggle="dropdown" href="#">
        添加链接
      </button>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="#" @click="AddLink('Rect')">Rect</a>
        <a class="dropdown-item" href="#" @click="AddLink('RectGroup')"
          >Rect Group</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import EditableRect from "./SVGEditableRect.vue";
export default {
  name: "SVGLinkEditor",
  components: { EditableRect },
  data() {
    return {
      current: null, //current Editable
      lastMouseX: 0,
      lastMouseY: 0,
      rate: 1,
      svgRect: null,
    };
  },
  props: {
    ui: Object,
    source: Object,
  },
  computed: {
    links() {
      if (!this.source) return [];
      if (!this.source.SVGLinks) {
        this.source.SVGLinks = [];
      }
      return this.source.SVGLinks;
    },
    width() {
      if (this.source && this.source.from != "placeholder") {
        return this.source.image.width;
      } else return 1070;
    },
    height() {
      if (this.source && this.source.from != "placeholder") {
        return this.source.image.height;
      } else return 1600;
    },
    imageDateURL() {
      if (this.source && this.source.from != "placeholder") {
        return URL.createObjectURL(this.source.blob);
      } else return "";
    },
  },
  methods: {
    InitEditable(inst) {
      if (inst.type == "Rect" && inst.linkInfoRef.needInit) {
        inst.width = this.width / 2;
        inst.height = this.height / 16;
        inst.linkInfoRef.needInit = false;
      }
    },
    StartEdit(obj) {
      this.current = obj.target;
      this.current.editState = "on";
      this.svgRect = this.$refs.svg.getBoundingClientRect();

      let displayWidth = this.svgRect.right - this.svgRect.left;
      //let displayHeight = rect.bottom - rect.top;
      this.rate = this.width / displayWidth;
      let e = obj.event;
      this.lastMouseX = e.clientX - this.svgRect.left;
      this.lastMouseY = e.clientY - this.svgRect.top;
    },
    MouseMove(e) {
      if (!this.current) return;
      let mouseX = e.clientX - this.svgRect.left;
      let mouseY = e.clientY - this.svgRect.top;
      let deltaX = (mouseX - this.lastMouseX) * this.rate;
      let deltaY = (mouseY - this.lastMouseY) * this.rate;
      switch (this.current.editType) {
        case "drag":
          {
            this.current.x += deltaX;
            this.current.y += deltaY;
          }
          break;
        case "scale":
          {
            this.current.width += deltaX;
            this.current.height += deltaY;
          }
          break;
      }
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;
    },
    MouseUp(e) {
      if (this.current) {
        this.current.editState = "";
        this.current.UpdateArgs();
        console.log(this.source);
        this.current = null;
      }
    },
    AddLink(type) {
      this.links.push({ type: type, id: GenarateId(), needInit: true });
    },
  },
};
</script>
<style scoped>
#svg_display {
  display: inline-block;
  height: 75vh;
  width: 50%;
}
svg {
  max-height: 100%;
  max-width: 100%;
}
rect:hover {
  fill: #ff8800;
}
#svg_editor {
  display: inline-block;
  width: 50%;
  height: 75vh;
  vertical-align: top;
}
</style>