<template>
	<div>
		<mt-header title="商场列表"></mt-header>
		<div class="building-list">
			<mt-cell v-for="item in buildings" :key="item.building_id" @click="toMap(item)" 
				to="/selectInfo"
				:title="item.name" 
				:label="item.address" 
				is-link>
				<img src="/images/logo.png" class="building-icon">
			</mt-cell>
		</div>
	</div>  	
</template>

<script>
import ajax from '../utils/ajax';
import util from '../utils/util';

export default {
  name: 'BuildingList',
  data: function() {
    return {
	  buildings: [],
	  selectedBuildingId: 0
    };
  },
  mounted: function() {
    const that = this;
    this.loadBuilding().then(data => {
      if (data) {
        that.buildings = data;
      }
    });
  },
  methods: {
    toMap: function(item) {
      this.$router.push({
        path: '/selectInfo',
        query: { id: item.building_id, name: item.name }
      });
      this.globalData.currentBuilding = {
        id: item.building_id,
        name: item.name
      };
    },

    loadBuilding: function(buildingId) {
      return ajax
        .get('/indoor/building')
        .then(res => {
          if (res && res.data) {
            return res.data;
          } else {
            return null;
          }
        })
        .catch(err => {
          console.error(err);
          return null;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.building-list {
		margin-top: 3px;
	}
	img.building-icon {
		width: 50px;
		height: 50px;
		/* border: 1px solid #eee; */
	}
</style>
