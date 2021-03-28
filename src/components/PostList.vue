<template>
  <div class="post-list">

    <div
      v-for="post in posts"
      :key="post.id"
      class="post"
    >

      <div class="user-info">
        <a href="#" class="user-name">
          {{ userById(post.userId).name }}
        </a>

        <a href="#">
          <img class="avatar-large" :src="userById(post.userId).avatar" alt="avatar">
        </a>

        <p class="desktop-only text-small">107 posts</p>

      </div>

      <div class="post-content">
        <div>
          <p>{{ postById(post.id).text }}</p>
        </div>
      </div>

      <div class="post-date text-faded">{{ postById(post.id).publishedAt }}</div>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'

export default {
  name: 'PostList',
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
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
  }
}
</script>

<style scoped>
.post-list {
  margin-top: 20px;
}
</style>
