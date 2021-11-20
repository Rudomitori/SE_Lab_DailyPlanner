<template>
    <div class="app-container container is-fullhd h-100vh is-flex is-align-items-center is-justify-content-center">
        <div class="box app has-background-white-ter is-flex columns p-2">
            <ScheduleGrid class="column is-10" ref="scheduleGrid"/>
            <ControlSidebar class="column"
                            @open-current-week="scheduleGrid.openCurrentWeek()"
                            @open-next-week="scheduleGrid.openNextWeek()"
                            @open-prev-week="scheduleGrid.openPrevWeek()"/>
        </div>
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
