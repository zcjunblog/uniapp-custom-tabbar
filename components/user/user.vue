<template>
  <div class="main">
    user
  </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      user: state => state.user,

    })
  },
  watch:{

  },
  mounted(){

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">

</style>
