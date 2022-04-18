import { createStore } from 'vuex'
import { findById, updateOrInsert } from '@/helpers'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
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
      commit('setItem', { resource: 'users', item: user })
    },
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, emoji: '🙋' })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' })
    },
    fetchAllCategories ({ commit }) {
      console.log('🔥', '🏷', 'all')

      return new Promise((resolve) => {
        getDocs(collection(db, 'categories')).then((querySnapshot) => {
          const categories = querySnapshot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const item = { ...doc.data(), id: doc.id }

            commit('setItem', { resource: 'categories', item })

            return item
          })

          resolve(categories)
        }).catch(() => console.log('No such document!'))
      })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, emoji: '🏁' })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' })
    },
    fetchItem ({ state, commit }, { id, emoji, resource }) {
      console.log('🔥', emoji, id)

      return new Promise((resolve) => {
        const docRef = doc(db, resource, id)

        getDoc(docRef)
          .then(docSnap => {
            if (docSnap.exists()) {
              const item = { ...docSnap.data(), id: docSnap.id }

              commit('setItem', { resource, id, item })

              resolve(item)
            }
          })
          .catch(() => console.log('No such document!'))
      })
    },
    createPost ({ commit, state }, post) {
      post.id = 'qqqq' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setItem', { resource: 'posts', item: post }) // set the post
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const id = 'qqqq' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }

      commit('setItem', { resource: 'threads', item: thread })
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

      commit('setItem', { resource: 'threads', item: newThread })
      commit('setItem', { resource: 'posts', item: newPost })

      return findById(state.threads, id)
    },
    fetchItems ({ dispatch }, { ids, resource, emoji }) {
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
    }
  },
  mutations: {
    setItem (state, { resource, item }) {
      updateOrInsert(state[resource], item)
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
