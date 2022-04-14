import { createStore } from 'vuex'
import { findById, updateOrInsert } from '@/helpers'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/plugins/firebase'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)

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
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)

        return {
          ...thread,
          get author () {
            if (!thread) return null

            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            if (!thread) return null

            return thread.posts.length - 1
          },
          get contributorsCount () {
            if (!thread) return null

            return thread.contributors.length
          }
        }
      }
    }
  },
  actions: {
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    fetchThread ({ state, commit }, { id }) {
      console.log('🔥📄', id)

      return new Promise((resolve) => {
        const threadDocRef = doc(db, 'threads', id)

        getDoc(threadDocRef)
          .then(threadDocSnap => {
            if (threadDocSnap.exists()) {
              const thread = { ...threadDocSnap.data(), id: threadDocSnap.id }

              commit('setThread', { thread })

              resolve(thread)
            }
          })
          .catch(() => console.log('No such document!'))
      })
    },
    fetchUser ({ state, commit }, { id }) {
      console.log('🔥🙋', id)

      return new Promise((resolve) => {
        const userDocRef = doc(db, 'users', id)

        getDoc(userDocRef)
          .then(userDocSnap => {
            if (userDocSnap.exists()) {
              const user = { ...userDocSnap.data(), id: userDocSnap.id }

              commit('setUser', { user })

              resolve(user)
            }
          })
          .catch(() => console.log('No such document!'))
      })
    },
    fetchPost ({ state, commit }, { id }) {
      console.log('🔥💬', id)

      return new Promise((resolve) => {
        const postDocRef = doc(db, 'posts', id)

        getDoc(postDocRef)
          .then(postDocSnap => {
            if (postDocSnap.exists()) {
              const post = { ...postDocSnap.data(), id: postDocSnap.id }

              commit('setPost', { post })

              resolve(post)
            }
          })
          .catch(() => console.log('No such document!'))
      })
    },
    createPost ({ commit, state }, post) {
      post.id = 'qqqq' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', { post }) // set the post
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const id = 'qqqq' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }

      commit('setThread', { thread })
      commit('appendThreadToUser', { threadId: id, parentId: userId })
      commit('appendThreadToForum', { childId: id, parentId: forumId })
      dispatch('createPost', { text, threadId: id })

      return findById(state.threads, id)
    },
    async updateThread ({ commit, state, dispatch }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }

      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })

      return findById(state.threads, id)
    }
  },
  mutations: {
    setUser (state, { user }) {
      updateOrInsert(state.users, user)
    },
    setPost (state, { post }) {
      updateOrInsert(state.posts, post)
    },
    setThread (state, { thread }) {
      updateOrInsert(state.threads, thread)
    },
    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads'
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors'
    })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)

    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
