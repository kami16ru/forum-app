<template>
  <div class="col-full">
    <div class="thread-list">

      <h2 class="list-title">Threads</h2>

      <ThreadItem v-for="thread in threads" :key="thread.id" :thread="thread" :users="users" />

    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'
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
  data () {
    return {
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  methods: {
    postById (postId) {
      return this.posts.find(p => p.id === postId)
    },
    userById (userId) {
      return this.users.find(u => u.id === userId)
    },
    userNameByPostId (postId) {
      return this.userById(this.postById(postId).userId).name
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
