<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Расписания в браузере</p>
            <b-button
                label="Закрыть" outlined
                @click="$emit('close')" />
        </header>
        <section class="modal-card-body brb">
            <b-field label="Ключ нового сохранения" label-position="on-border">
                <b-input type="text" v-model="newKey"/>
                <p class="control">
                    <b-button class="button is-primary" @click="saveSchedule(newKey)">Сохранить</b-button>
                </p>
            </b-field>
            <b-table :data='savedScheduleInfo'>
                <b-table-column field="name" label="Название" sortable v-slot="props">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="name" label="Ключ" sortable v-slot="props">
                    {{ props.row.key }}
                </b-table-column>
                <b-table-column width="120" v-slot="props">
                    <b-icon icon="save"
                            class="is-clickable"
                            @click.native="saveSchedule(props.row.key)"
                            size="is-little"/>
                    <b-icon icon="folder-open"
                            class="is-clickable"
                            @click.native="loadSchedule(props.row.key)"
                            size="is-little"/>
                    <b-icon type="is-danger"
                            icon="trash-alt"
                            class="is-clickable is-danger"
                            @click.native="removeSchedule(props.row.key)"
                            size="is-little"/>
                </b-table-column>
            </b-table>
        </section>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, Watch} from "vue-property-decorator";
import TaskEditorForm from "@/components/TaskEditorForm.vue";
import {rootStoreModule} from "@/store";
import {localStorageService} from "@/Storages";

@Component({
    components: {TaskEditorForm}
})
export default class LocalSaveLoadCard extends Vue {
    savedScheduleInfo: ReturnType<typeof localStorageService.getSavedScheduleInfo> | null = null

    newKey = "Новое сохранение расписания";

    created() {
        this.savedScheduleInfo = localStorageService.getSavedScheduleInfo()
    }

    get storeContext() {
        return rootStoreModule.context(this.$store);
    }

    saveSchedule(key: string) {
        this.storeContext.actions.saveScheduleToLocalStorage(key);
        this.savedScheduleInfo = localStorageService.getSavedScheduleInfo()
    }

    loadSchedule(key: string) {
        this.storeContext.actions.loadScheduleFromLocalStorage(key);
    }

    removeSchedule(key: string) {
        this.storeContext.actions.removeScheduleFromLocalStorage(key);
        this.savedScheduleInfo = localStorageService.getSavedScheduleInfo()
    }
}
</script>

<style scoped>

</style>