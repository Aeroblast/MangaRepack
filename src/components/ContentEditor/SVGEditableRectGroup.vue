<template>
  <rect
    fill-opacity="0.25"
    v-for="(src, i) in linkInfoRef.args.targetArray"
    :key="i"
    :x="GetChildRectX(linkInfoRef.args, i)"
    :y="GetChildRectY(linkInfoRef.args, i)"
    :width="GetChildRectW(linkInfoRef.args, i)"
    :height="GetChildRectH(linkInfoRef.args, i)"
  >
    <title>
      {{ src ? src.toc : "" }}
    </title>
  </rect>
  <text
    v-for="(src, i) in linkInfoRef.args.targetArray"
    :key="i"
    :x="GetChildRectX(linkInfoRef.args, i)"
    :y="
      GetChildRectY(linkInfoRef.args, i) +
      GetChildRectH(linkInfoRef.args, i) / 2
    "
    :font-size="GetChildRectH(linkInfoRef.args, i) / 2"
  >
    {{
      linkInfoRef.args && linkInfoRef.args.targetArray[i]
        ? linkInfoRef.args.targetArray[i].toc
        : ""
    }}
  </text>

  <rect
    class="group edit"
    :data-active="id == activeId"
    ref="rect"
    fill-opacity="0.25"
    :data-edit="editType"
    :x="linkInfoRef.args.x"
    :y="linkInfoRef.args.y"
    :width="linkInfoRef.args.width"
    :height="linkInfoRef.args.height"
    @mousedown="MouseDown($event)"
    @mousemove="MouseMove($event)"
  ></rect>
</template>

<script>
import {
  GetChildRectX,
  GetChildRectY,
  GetChildRectW,
  GetChildRectH,
} from "../../RectGroup.js";
export default {
  name: "EditableRectGroup",
  data() {
    return {
      type: "RectGroup",
      editType: "",
      editState: "",
    };
  },
  props: {
    id: Number,
    activeId: Number,
    linkInfoRef: Object,
  },
  emits: ["edit"],
  computed: {},
  methods: {
    MouseDown(e) {
      this.$emit("edit", { target: this, event: e });
    },
    MouseMove(e) {
      if (this.editState) return;
      let rect = e.target.getBoundingClientRect();
      let displayWidth = rect.right - rect.left;
      let displayHeight = rect.bottom - rect.top;
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;

      if (mouseY > displayHeight - 10 && mouseX > displayWidth - 10) {
        this.editType = "scale";
      } else {
        this.editType = "drag";
      }
    },
    GetChildRectX(args, i, rectW = 0) {
      return GetChildRectX(args, i, rectW);
    },
    GetChildRectY(args, i, rectH = 0) {
      return GetChildRectY(args, i, rectH);
    },
    GetChildRectW(args, i) {
      return GetChildRectW(args);
    },
    GetChildRectH(args, i) {
      return GetChildRectH(args);
    },
  },
  mounted() {},
};
</script>
<style scoped>
rect[data-edit^="drag"] {
  cursor: move;
}
rect[data-edit^="scale"] {
  cursor: se-resize;
}
</style>