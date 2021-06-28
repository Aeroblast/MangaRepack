<template>
  <div
    class="svg_element_menu card card-body mt-3"
    :data-active="id == activeId"
  >
    <label>[Rect] id={{ id }}</label>

    <div class="input-group w-50">
      <div class="input-group-prepend">
        <label class="input-group-text">入口</label>
      </div>
      <select class="custom-select" v-model="link">
        <option :value="null" selected>- - -</option>
        <option
          v-for="entry in availableEntries"
          :key="entry.filename"
          :value="entry"
        >
          {{ entry.toc }}
        </option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>x</label>
        <input
          type="number"
          class="form-control"
          v-model.number="linkInfoRef.args.x"
        />
      </div>
      <div class="form-group col-md-3">
        <label>y</label>
        <input
          type="number"
          class="form-control"
          v-model.number="linkInfoRef.args.y"
        />
      </div>
      <div class="form-group col-md-3">
        <label>width</label>
        <input
          type="number"
          class="form-control"
          v-model.number="linkInfoRef.args.width"
        />
      </div>
      <div class="form-group col-md-3">
        <label>height</label>
        <input
          type="number"
          class="form-control"
          v-model.number="linkInfoRef.args.height"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditableRectMenu",
  data() {
    return {};
  },
  props: {
    id: Number,
    linkInfoRef: Object,
    availableEntries: Array,
    activeId: Number,
  },
  emits: [],
  methods: {},
  computed: {
    link: {
      get() {
        if (this.linkInfoRef.needInit) return null;
        console.log(this.linkInfoRef);
        return this.linkInfoRef.args.target;
      },
      set(newValue) {
        console.log(newValue);
        this.linkInfoRef.args.target = newValue;
      },
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>