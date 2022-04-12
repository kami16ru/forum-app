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

import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/plugins/firebase'

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
    const threadDocRef = doc(db, 'threads', this.id)
    const threadDocSnap = await getDoc(threadDocRef)

    if (threadDocSnap.exists()) {
      const thread = { ...threadDocSnap.data(), id: threadDocSnap.id }

      this.$store.commit('setThread', { thread })

      const userDocRef = doc(db, 'users', thread.userId)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        const user = { ...userDocSnap.data(), id: userDocSnap.id }

        this.$store.commit('setUser', { user })
      } else {
        console.log('No such document!')
      }

      thread.posts.forEach((postId) => {
        const postDocRef = doc(db, 'posts', postId)

        getDoc(postDocRef).then((postDocSnap) => {
          const post = { ...postDocSnap.data(), id: postDocSnap.id }

          this.$store.commit('setPost', { post })

          const userDocRef = doc(db, 'users', post.userId)

          getDoc(userDocRef).then((userDocSnap) => {
            const user = { ...userDocSnap.data(), id: userDocSnap.id }

            this.$store.commit('setUser', { user })
          }).catch(() => console.log('No such document!'))
        }).catch(() => console.log('No such document!'))
      })
    } else {
      console.log('No such document!')
    }
  }
}
</script>

<style scoped>
.post-listing-editor {
  flex: 1 1 83%;
}
</style>
