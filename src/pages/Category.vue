<template>
  <ForumList
    :title="category.name"
    :forums="getForumsForCategory(category)"
    :category-id="id"
  />
</template>

<script>
import ForumList from '@/components/ForumList'
import { findById } from '@/helpers'

export default {
  name: 'Category',
  components: { ForumList },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.id) || {}
    }
  },
  async created () {
    const category = await this.$store.dispatch('fetchCategory', { id: this.id })

    this.$store.dispatch('fetchForums', { ids: category.forums })
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>

<style scoped>

</style>
