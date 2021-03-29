<template>
  <div class="thread">
    <div>
      <p>
        <router-link :to="{ name: 'ThreadShow', params: { id: thread.id } }">{{ thread.title }}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="#">{{ userById(thread.userId).name }}</a>, <AppDate :timestamp="thread.publishedAt"/>
      </p>
    </div>

    <div class="activity">
      <p class="replies-count">
        {{ thread.posts.length }} replies
      </p>

      <img class="avatar-medium"
           :src="userById(thread.userId).avatar"
           alt="avatar">

      <div>
        <p class="text-xsmall">
          <a href="#">{{ userById(thread.userId).name }}</a>
        </p>
        <p class="text-xsmall text-faded">
          <AppDate :timestamp="thread.publishedAt"/>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import AppDate from '@/components/AppDate'

export default {
  name: 'ThreadItem',
  components: {
    AppDate
  },
  props: {
    thread: {
      type: Object,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
  },
  methods: {
    userById (userId) {
      return this.users.find(u => u.id === userId)
    }
  }
}
</script>

<style scoped>
.thread-list .thread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0 5px 20px;
  min-height: 45px;
}

.thread-list .thread:nth-child(odd) {
  background: rgba(73, 89, 96, 0.06);
  border-bottom-left-radius: 20px;
}

.thread-list .thread:last-child {
  border-bottom-left-radius: 0;
}

.thread-list .thread .replies-count {
  flex-basis: 35%;
}

.thread-list .thread .activity {
  flex-basis: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.thread-list .thread .activity .avatar-medium {
  margin-right: 10px;
}
</style>
