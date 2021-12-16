<template>
    <div class="has-background-white-ter is-flex p-3 h-100vh">
        <ScheduleGrid class="w-100 p-3" ref="scheduleGrid"/>
        <ControlSidebar
            class="p-3"
            @open-current-week="scheduleGrid.openCurrentWeek()"
            @open-next-week="scheduleGrid.openNextWeek()"
            @open-prev-week="scheduleGrid.openPrevWeek()"/>

    </div>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import ScheduleGrid from "@/components/ScheduleGrid.vue";
import ControlSidebar from "@/components/ControlSidebar.vue";

@Component({
  components: {
      ControlSidebar,
      ScheduleGrid
  },
})
export default class App extends Vue {
    @Ref() readonly scheduleGrid!: ScheduleGrid;
}
</script>

<style lang="scss">
.app {
    height: 45rem;
    width: 100%;
}

.app-container {
}
</style>
