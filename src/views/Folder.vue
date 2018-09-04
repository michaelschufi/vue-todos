<template>
  <div></div>
</template>

<script>
import constants from '../constants'

export default {
  beforeRouteUpdate(to, from, next) {
    const currentFolder = constants.folders.find(folder => folder.value === to.params.folder)
    this.$store.commit('setPageTitle', currentFolder.text)
    next()
  },
  data() {
    return {
      folders: Object.assign({}, constants.folders),
    }
  },
}
</script>
