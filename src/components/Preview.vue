<template>
  <div id="previewNav" ref="pageList">
    <div
      class="pageListItem"
      v-for="s in sources"
      :key="s"
      :data-display="s.toc || s.landmark ? '' : 'none'"
    >
      <img :src="s.thumbURL" />
      <label class="short_filename"
        ><span :title="s.filename">{{ s.filename }}</span></label
      >
      <div class="landmark_label" :data-display="s.landmark ? 'true' : ''">
        <span class="alert-primary">{{ s.landmark }}</span>
      </div>
      <div class="toc_label" :data-display="s.toc ? 'true' : ''">
        <span class="alert-success">{{ s.toc }}</span>
      </div>
    </div>
  </div>
  <div id="previewData">
    <div class="input-group">
      <button class="btn" type="button" v-on:click="$emit('save')">
        {{ ui.menu_save }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Preview",
  props: {
    ui: Object,
    sources: Array,
  },
  emits: ["save"],
};
</script>


<style scoped>
#previewNav {
  width: 20%;
  height: 100%;
  overflow-y: scroll;
  direction: rtl;
  text-align: right;
  display: inline-block;
}

#previewNav > .pageListItem[data-display="none"] {
  height: 1.5em;
  overflow: hidden;
}

#previewNav > .pageListItem[data-display="none"] > img {
  display: none;
}

#previewNav > .pageListItem:nth-child(1) {
  width: 100%;
}

#previewNav > .pageListItem:nth-child(1) > img {
  width: 50%;
}

#previewData {
  display: inline-block;
  height: 100%;
  width: 70%;
  vertical-align: top;
}
</style>
