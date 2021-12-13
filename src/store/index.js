import { createStore } from 'vuex'
import sourceData from '@/data'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: state => {
      const user = state.users.find(user => user.id === state.authId)

      if (!user) return null

      return {
        ...user,
        get posts () {
          return state.posts.filter(post => post.userId === user.id)
        },
        get postsCount () {
          return this.posts.length
        },
        get threads () {
          return state.threads.filter(thread => thread.userId === user.id)
        },
        get threadsCount () {
          return this.threads.length
        }
      }
    }
  },
  actions: {
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    createPost ({ commit, state }, post) {
      post.id = 'qqqq' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', { post }) // set the post
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    },
    createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const id = 'qqqq' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }

      commit('setThread', { thread })
      commit('appendThreadToUser', { threadId: id, userId })
      commit('appendThreadToForum', { threadId: id, forumId })
      dispatch('createPost', { text, threadId: id })
    }
  },
  mutations: {
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(user => user.id === userId)

      state.users[userIndex] = user
    },
    setPost (state, { post }) {
      state.posts.push(post)
    },
    setThread (state, { thread }) {
      state.threads.push(thread)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(thread => thread.id === threadId)

      thread.posts = thread.posts || []
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { threadId, forumId }) {
      const forum = state.forums.find(forum => forum.id === forumId)

      forum.threads = forum.threads || []
      forum.threads.push(threadId)
    },
    appendThreadToUser (state, { threadId, userId }) {
      const user = state.users.find(user => user.id === userId)

      user.threads = user.threads || []
      user.threads.push(threadId)
    }
  }
})
