<template>
  <Category
    v-for="category in categories"
    :key="category.id"
    :id="category.id"
  />
</template>

<script>
import Category from '@/pages/Category'

export default {
  name: 'CategoryList',
  components: { Category },
  props: {
    categories: {
      required: true,
      type: Array
    }
  }
}
</script>

<style scoped>

</style>
