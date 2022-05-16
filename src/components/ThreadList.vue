<template>
  <div class="col-full">
    <div class="thread-list">

      <h2 class="list-title">Threads</h2>

      <ThreadItem
        v-for="thread in threads"
        :key="thread.id"
        :thread="thread"
        :users="users"
      />

    </div>
  </div>
</template>

<script>
import ThreadItem from './ThreadItem'

export default {
  name: 'ThreadList',
  components: {
    ThreadItem
  },
  props: {
    threads: {
      type: Array,
      required: true
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    users () {
      return this.$store.state.users
    }
  }
}
</script>

<style scoped>
.thread-list {
  padding: 0;
  background-color: white;
}
</style>
