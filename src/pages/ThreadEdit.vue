<template>
  <div class="col-full push-top">

    <h1>Editing <i>{{ thread.title }}</i></h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'

export default {
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads.find(thread => thread.id === this.id)
    },
    text () {
      return this.$store.state.posts.find(post => post.id === this.thread.posts[0]).text
    }
  },
  methods: {
    ...mapActions({
      updateThread: 'updateThread'
    }),
    async save ({ title, text }) {
      const thread = await this.updateThread({
        title,
        text,
        id: this.thread.id
      })

      await this.$router.push({
        name: 'ThreadShow',
        params: {
          id: thread.id
        }
      })
    },
    cancel () {
      this.$router.push({
        name: 'ThreadShow',
        params: {
          id: this.thread.id
        }
      })
    }
  }
}
</script>
