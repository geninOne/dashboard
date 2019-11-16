<template>
  <v-container class="card-container">
    <v-card
      class="card"
      max-width="400"
      outlined
      v-for="item in itemCards"
      :key="item"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">OVERLINE</div>
          <v-list-item-title class="headline mb-1"
            >Headline 5</v-list-item-title
          >
          <v-list-item-subtitle
            >Greyhound divisely hello coldly fonwderfully
            {{ item }}</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn text>Button</v-btn>
        <v-btn text>Button</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Card',
  props: {
    itemCards: {
      type: Array,
      required: true
    }
  }
});
</script>

<style lang="scss">
.card-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .card {
    margin-bottom: 20px;
  }
}
</style>
