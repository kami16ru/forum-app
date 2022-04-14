<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', params: { id: thread.id }}"
        class="btn-green btn-small"
        tag="button"
      >Edit thread</router-link>
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <AppDate v-if="thread.publishedAt" :timestamp="thread.publishedAt" />.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{ `${thread.repliesCount} replies by ${thread.contributorsCount} contributors` }}
      </span>
    </p>

    <post-list :posts="threadPosts" />

    <post-editor @save="addPost"/>

  </div>
</template>

<script>

import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate'

export default {
  name: 'PageThreadShow',
  components: {
    AppDate,
    PostList,
    PostEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.$store.dispatch('createPost', post)
    }
  },
  async created () {
    // fetch the thread
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })

    // fetch the user
    this.$store.dispatch('fetchUser', { id: thread.userId })

    // fetch the posts
    thread.posts.forEach(async (postId) => {
      const post = await this.$store.dispatch('fetchPost', { id: postId })

      // fetch the user for each post
      this.$store.dispatch('fetchUser', { id: post.userId })
    })
  }
}
</script>

<style scoped>
.post-listing-editor {
  flex: 1 1 83%;
}
</style>
