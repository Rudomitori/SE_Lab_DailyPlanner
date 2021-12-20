<template>
    <div>
        <b-field label="Имя задачи" label-position="on-border">
            <b-input v-model="task.name"></b-input>
        </b-field>

        <b-field label="Время задачи" label-position="on-border">
            <b-datetimepicker
                v-model="dateTime"
                icon="calendar"
                horizontal-time-picker>
            </b-datetimepicker>
        </b-field>

        <b-field>
            <b-checkbox v-model="task.isDone">Выполнена</b-checkbox>
        </b-field>

        <b-field label="Тип" label-position="on-border">
            <b-select :value="task.typeId" @input="onTaskTypeSelected($event)">
                <option v-for="type of taskTypes" :value="type.id">{{ type.name }}</option>
            </b-select>
        </b-field>

        <b-field label="Описание" 
                 label-position="on-border">
            <b-input v-model="task.description" type="textarea"></b-input>
        </b-field>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, VModel} from "vue-property-decorator";
import {rootStoreModule} from "@/store";
import Task from "@/Models/Task";
import moment from "moment";
import TaskType from "@/Models/TaskType";

@Component
export default class TaskEditorForm extends Vue {
    @VModel({required:true})
    readonly task!: Task;

    get dateTime() {
        return this.task.begin.toDate()
    }

    set dateTime(dateTime: Date) {
        this.task.begin = moment(dateTime);
        const segmentLength = this.storeContext.state.schedule.segmentLength;
        this.task.end = this.task.begin.clone().add(segmentLength)
    }


    created() {
        this.task.taskType ||= this.storeContext.getters.taskTypes
            .find(x => x.id === this.task.id)!
    }

    get storeContext() {
        return rootStoreModule.context(this.$store)
    }

    get taskTypes() {
        return this.storeContext.getters.taskTypes
    }

    onTaskTypeSelected(typeId: string) {
        const taskType = this.taskTypes.find(x => x.id === typeId)!;
        this.task.taskType = taskType
        this.task.typeId = taskType.id
    }
}
</script>

<style scoped>

</style>