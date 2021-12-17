<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Редактирование задачи</p>
            <div class="buttons">
                <b-button
                    label="Отмена"
                    type="is-danger" outlined
                    @click="$emit('close')" />
                <b-button
                    label="Принять"
                    type="is-primary"
                    @click="saveChanges"/>
            </div>
        </header>
        <section class="modal-card-body brb">
            <TaskEditorForm v-if="taskId" v-model="taskCopy"/>
        </section>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, Watch} from "vue-property-decorator";
import TaskEditorForm from "@/components/TaskEditorForm.vue";
import {rootStoreModule} from "@/store";
import Task, {cloneTask} from "@/Models/Task";
import {NavPropertyCloneOption} from "@/utils";

@Component({
    components: {TaskEditorForm}
})
export default class TaskEditorCard extends Vue {
    @Prop({required: true, type: String}) taskId!: string;

    taskCopy: Task | null = null;

    @Watch("taskId")
    onTaskIdChanged() {
        const task = this.storeContext.getters.tasks
            .find(x => x.id === this.taskId)!;
        this.taskCopy = cloneTask(task, NavPropertyCloneOption.Include)
    }

    created() {
        this.onTaskIdChanged()
    }

    get storeContext() {
        return rootStoreModule.context(this.$store);
    }

    saveChanges() {
        this.storeContext.actions.updateTask(this.taskCopy!)
        this.$emit('close')
    }
}
</script>

<style scoped>

</style>