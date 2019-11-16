<template>
  <div class="RouterPlanner" style="width: 100%; height: 100%">
    <Card :item-cards="[1, 2, 3]" />
  </div>
</template>

<script>
import Card from '@/components/Card.vue';
export default {
  name: 'RouterPlanner',
  components: {
    Card
  }
};
</script>
