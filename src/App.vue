<template>
    <div class="has-background-white-ter is-flex p-3 h-100vh">
        <ScheduleGrid class="w-100 pr-3" ref="scheduleGrid" v-model="selectedTaskId"/>
        <ControlSidebar
            class="p-3"
            @open-current-week="scheduleGrid.openCurrentWeek()"
            @open-next-week="scheduleGrid.openNextWeek()"
            @open-prev-week="scheduleGrid.openPrevWeek()">
                <div v-if="selectedTask && selectedTask.description" class="content">
                    <h5>Описание задачи</h5>
                    <p>{{selectedTask.description}}</p>
                </div>
                <div class="mt-auto" v-if="selectedTask">
                    <b-button @click="openTaskDuplicatingModal(selectedTask.id)">Дублировать задачу</b-button>
                </div>
            </ControlSidebar>

    </div>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import ScheduleGrid from "@/components/ScheduleGrid.vue";
import ControlSidebar from "@/components/ControlSidebar.vue";
import {rootStoreModule} from "@/store";
import {ModalProgrammatic} from "buefy";
import TaskDuplicatingCard from "@/components/TaskDuplicatingCard.vue";

@Component({
  components: {
      ControlSidebar,
      ScheduleGrid
  },
})
export default class App extends Vue {
    @Ref() readonly scheduleGrid!: ScheduleGrid;
    selectedTaskId: string | null = null

    get storeContext() {
        return rootStoreModule.context(this.$store)
    }

    get selectedTask() {
        return this.storeContext.getters.tasks.find(x => x.id === this.selectedTaskId) || null
    }

    openTaskDuplicatingModal(taskId: string) {
        ModalProgrammatic.open({
            parent: this,
            component: TaskDuplicatingCard,
            props: { taskId }
        })
    }
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
