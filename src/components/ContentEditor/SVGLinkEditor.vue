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
        :activeId="currentMenu ? currentMenu.id : -1"
        @edit="StartEdit($event)"
      ></component>
    </svg>
  </div>
  <div id="svg_editor">
    <div>提示：先标记目录入口。</div>
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
      &nbsp;
      <button
        class="btn btn-outline-danger"
        type="button"
        v-if="this.currentMenu"
        v-on:click="RemoveCurrent"
      >
        删除选中项
      </button>
    </div>

    <component
      v-for="link in links"
      v-bind:is="'Editable' + link.type + 'Menu'"
      :key="link.id"
      :id="link.id"
      :linkInfoRef="link"
      :activeId="currentMenu ? currentMenu.id : -1"
      :availableEntries="availableEntries"
    ></component>
  </div>
</template>

<script>
import EditableRect from "./SVGEditableRect.vue";
import EditableRectMenu from "./SVGEditableRectMenu.vue";
export default {
  name: "SVGLinkEditor",
  components: { EditableRect, EditableRectMenu },
  data() {
    return {
      currentMouseEdit: null, //current Editable
      currentMenu: null,
      lastMouseX: 0,
      lastMouseY: 0,
      rate: 1,
      svgRect: null,
    };
  },
  props: {
    ui: Object,
    source: Object,
    availableEntries: Array,
  },
  computed: {
    links() {
      //SVGLink
      //SVGLink.id
      //SVGLink.args
      //Rect target width height x y
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
    StartEdit(obj) {
      this.currentMenu = obj.target;
      this.currentMouseEdit = obj.target;
      this.currentMouseEdit.editState = "on";
      this.svgRect = this.$refs.svg.getBoundingClientRect();

      let displayWidth = this.svgRect.right - this.svgRect.left;
      //let displayHeight = rect.bottom - rect.top;
      this.rate = this.width / displayWidth;
      let e = obj.event;
      this.lastMouseX = e.clientX - this.svgRect.left;
      this.lastMouseY = e.clientY - this.svgRect.top;
    },
    MouseMove(e) {
      if (!this.currentMouseEdit) return;
      let mouseX = e.clientX - this.svgRect.left;
      let mouseY = e.clientY - this.svgRect.top;
      let deltaX = (mouseX - this.lastMouseX) * this.rate;
      let deltaY = (mouseY - this.lastMouseY) * this.rate;
      switch (this.currentMouseEdit.editType) {
        case "drag":
          {
            this.currentMouseEdit.linkInfoRef.args.x += deltaX;
            this.currentMouseEdit.linkInfoRef.args.y += deltaY;
          }
          break;
        case "scale":
          {
            this.currentMouseEdit.linkInfoRef.args.width += deltaX;
            this.currentMouseEdit.linkInfoRef.args.height += deltaY;
          }
          break;
      }
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;
    },
    MouseUp(e) {
      if (this.currentMouseEdit) {
        this.currentMouseEdit.linkInfoRef.args.x = parseInt(
          this.currentMouseEdit.linkInfoRef.args.x
        );
        this.currentMouseEdit.linkInfoRef.args.y = parseInt(
          this.currentMouseEdit.linkInfoRef.args.y
        );
        this.currentMouseEdit.linkInfoRef.args.width = parseInt(
          this.currentMouseEdit.linkInfoRef.args.width
        );
        this.currentMouseEdit.linkInfoRef.args.height = parseInt(
          this.currentMouseEdit.linkInfoRef.args.height
        );
        this.currentMouseEdit.editState = "";
        this.currentMouseEdit.UpdateArgs();
        this.currentMouseEdit = null;
      }
    },
    AddLink(type) {
      let args;
      switch (type) {
        case "Rect":
          args = {
            x: 0,
            y: 0,
            width: this.width / 2,
            height: this.height / 8,
          };
          break;
      }
      this.links.push({
        type: type,
        id: GenarateId(),
        needInit: true,
        args: args,
      });
    },
    RemoveCurrent() {
      for (const i in this.links) {
        if (this.links[i].id == this.currentMenu.id) {
          this.links.splice(i, 1);
          this.currentMenu = null;
          return;
        }
      }
    },
  },
};
</script>
<style>
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
  fill: #ff8800 !important;
}
rect[data-active="true"] {
  fill: rgb(0, 195, 195);
}
.svg_element_menu {
  display: none;
}
.svg_element_menu[data-active="true"] {
  display: block;
}
#svg_editor {
  display: inline-block;
  width: 50%;
  height: 75vh;
  vertical-align: top;
}
</style>