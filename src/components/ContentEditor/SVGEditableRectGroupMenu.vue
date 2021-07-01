<template>
  <div
    class="svg_element_menu card card-body mt-3"
    :data-active="id == activeId"
  >
    <label>[RectGroup] id={{ id }}</label>

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
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>gap</label>
        <input
          type="number"
          class="form-control"
          v-model.number="linkInfoRef.args.gap"
        />
      </div>
      <div class="form-group col-md-3">
        <label>count</label>
        <input type="number" class="form-control" v-model.number="count" />
      </div>
    </div>
    <div
      class="input-group w-50"
      v-for="(src, i) in linkInfoRef.args.targetArray"
      :key="i"
    >
      <div class="input-group-prepend">
        <label class="input-group-text">TOC Entry</label>
      </div>
      <select
        class="custom-select"
        @change="SetLink($event.target.value, i)"
        :value="src ? src.filename : null"
      >
        <option :value="null">- - -</option>
        <option
          v-for="entry in availableEntries"
          :key="entry.filename"
          :value="entry.filename"
        >
          {{ entry.toc }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditableRectGroupMenu",
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
  methods: {
    SetLink(newValue, i) {
      for (const entry of this.availableEntries) {
        if (entry.filename == newValue) this.linkInfoRef.args.targetArray[i] = entry;
      }
      console.log(this.linkInfoRef.args.targetArray);
    },
  },
  computed: {
    link: {
      get() {
        if (!this.linkInfoRef.args.target) return null;

        return this.linkInfoRef.args.target.filename;
      },
      set(newValue) {
        for (const entry of this.availableEntries) {
          if (entry.filename == newValue) this.linkInfoRef.args.target = entry;
        }
      },
    },
    count: {
      get() {
        return this.linkInfoRef.args.targetArray.length;
      },
      set(newValue) {
        if (newValue < this.linkInfoRef.args.targetArray.length) {
          while (newValue != this.linkInfoRef.args.targetArray.length)
            this.linkInfoRef.args.targetArray.pop();
        } else {
          while (newValue != this.linkInfoRef.args.targetArray.length)
            this.linkInfoRef.args.targetArray.push(null);
        }
      },
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>