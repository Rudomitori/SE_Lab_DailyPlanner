<template>
    <div class="modal-card" style="width: 500px;margin: 0 auto;">
    <header class="modal-card-head">
        <p class="modal-card-title">Редактирование категории</p>
        <b-button
            label="Принять"
            @click="$emit('close')"
            type="is-primary" />
    </header>
    <section class="modal-card-body brb">
        <b-field label="Название категории" horizontal>
            <b-input
                type="text"
                v-model="taskType.name"
                placeholder="Название категории"
                required>
            </b-input>
        </b-field>

        <b-field label="Цвет фона" horizontal>
            <b-input type="color" v-model="backgroundColor" required/>
        </b-field>
        <b-field label="Цвет текста" horizontal>
            <b-input type="color" v-model="textColor" required/>
        </b-field>
    </section>
</div>

</template>
<script lang="ts">
import {Component, Vue, VModel} from "vue-property-decorator";
import TaskType from "@/Models/TaskType";
@Component
export default class EditCategoryComponent extends Vue {
    @VModel({required: true, })
    readonly taskType!: TaskType;

    private get backgroundColor() {
        return this.taskType.colors[0]
    }

    private set backgroundColor(color: string) {
        this.taskType.colors.splice(0, 1, color)
    }

    private get textColor() {
        return this.taskType.colors[1]
    }

    private set textColor(color: string) {
        this.taskType.colors.splice(1, 1, color)
    }
}
</script>
<style scoped>

</style>