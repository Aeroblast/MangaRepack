<template>
  <g>
    <text
      :x="linkInfoRef.args.x"
      :y="linkInfoRef.args.y + linkInfoRef.args.height / 2"
      :font-size="linkInfoRef.args.height / 2"
    >
      {{
        linkInfoRef.args && linkInfoRef.args.target
          ? linkInfoRef.args.target.toc
          : ""
      }}
    </text>
    <rect
      :data-active="id == activeId"
      ref="rect"
      fill-opacity="0.5"
      :data-edit="editType"
      :x="linkInfoRef.args.x"
      :y="linkInfoRef.args.y"
      :width="linkInfoRef.args.width"
      :height="linkInfoRef.args.height"
      @mousedown="MouseDown($event)"
      @mousemove="MouseMove($event)"
    ></rect>
  </g>
</template>

<script>
export default {
  name: "EditableRect",
  data() {
    return {
      type: "Rect",
      //x: 0,
      //y: 0,
      //width: 600,
      //height: 50,
      editType: "",
      editState: "",
    };
  },
  props: {
    id: Number,
    activeId: Number,
    needInit: Boolean,
    linkInfoRef: Object,
  },
  emits: ["edit"],
  computed: {},
  methods: {
    UpdateArgs() {
      // this.linkInfoRef.args = {
      //   x: this.x,
      //   y: this.y,
      //   width: this.width,
      //   height: this.height,
      // };
    },
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