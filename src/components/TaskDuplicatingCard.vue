<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Дублирование</p>
            <div class="buttons">
                <b-button
                    label="Принять"
                    type="is-primary"
                    @click="duplicate"/>
            </div>
        </header>
        <section class="modal-card-body brb">
            <b-field horizontal label="Кол-во недель">
                <b-input type="number" v-model="nextCountStr" min="0" step="1" placeholder="Назад" expanded></b-input>
                <b-input type="number" v-model="prevCountStr" min="0" step="1" placeholder="Вперёд" expanded></b-input>
            </b-field>
        </section>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import {rootStoreModule} from "@/store";

@Component
export default class TaskDuplicatingCard extends Vue {
    @Prop({required: true, type: String}) taskId!: string;

    prevCountStr = "0";
    nextCountStr = "0";

    get prevCount() {
        return Number.parseInt(this.prevCountStr)
    }

    get nextCount() {
        return Number.parseInt(this.nextCountStr)
    }

    duplicate() {
        this.storeContext.actions.duplicateTask({
            taskId: this.taskId,
            prevCount: this.prevCount,
            nextCount: this.nextCount
        })
        this.$emit("close")
    }

    get storeContext() {
        return rootStoreModule.context(this.$store);
    }
}
</script>

<style scoped>

</style>