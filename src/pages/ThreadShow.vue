<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />
    <form @submit.prevent="addPost">
      <div class="form-group">
        <textarea :value="newPostText" @input="newPostText = $event.target.value" name="" id="" cols="30" rows="10" class="form-input" />
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import PostList from '@/components/PostList'

export default {
  name: 'PageThreadShow',
  components: {
    PostList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      newPostText: ''
    }
  },
  computed: {
    thread () {
      return this.threads.find(thread => thread.id === this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost () {
      const postId = 'qqqq' + Math.random()
      const post = {
        id: postId,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
      }

      this.posts.push(post)
      this.thread.posts.push(postId)

      this.newPostText = ''
    }
  }
}
</script>

<style scoped>
.post-listing-editor {
  flex: 1 1 83%;
}
</style>
