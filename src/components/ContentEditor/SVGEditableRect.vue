<template>
  <rect
    ref="rect"
    fill-opacity="0.5"
    :data-edit="editType"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    @mousedown="MouseDown($event)"
    @mousemove="MouseMove($event)"
  ></rect>
</template>

<script>
export default {
  name: "EditableRect",
  data() {
    return {
      type: "Rect",
      x: 0,
      y: 0,
      width: 600,
      height: 50,
      editType: "",
      editState: "",
    };
  },
  props: { id: Number, needInit: Boolean, linkInfoRef: Object },
  emits: ["init", "edit"],
  computed: {},
  methods: {
    UpdateArgs() {
      this.linkInfoRef.args = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      };
      console.log(this.linkInfoRef);
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
  mounted() {
    if (this.linkInfoRef.args) {
      this.x = this.linkInfoRef.args.x;
      this.y = this.linkInfoRef.args.y;
      this.width = this.linkInfoRef.args.width;
      this.height = this.linkInfoRef.args.height;
    }
    this.$emit("init", this);
  },
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