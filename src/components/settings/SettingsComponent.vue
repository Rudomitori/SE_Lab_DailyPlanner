<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Настройки приложения</p>
            <div class="buttons">
                <b-button
                    label="Отмена"
                    type="is-danger" outlined
                    @click="$emit('close')" />
                <b-button
                    label="Принять"
                    type="is-primary"
                    @click="saveSettings"/>
            </div>
        </header>
        <section class="modal-card-body brb p-0">
            <b-tabs>
                <b-tab-item label="Время">
                    <TimeSetting v-model="scheduleCopy"/>
                </b-tab-item>

                <b-tab-item label="Хранилище">
                    <StorageSetting v-model="scheduleCopy"/>
                </b-tab-item>

                <b-tab-item label="Категории">
                    <CategorySetting v-model="scheduleCopy"/>
                </b-tab-item>
            </b-tabs>
        </section>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import TimeSetting from '@/components/settings/TimeSetting.vue'
import StorageSetting from '@/components/settings/StorageSetting.vue'
import CategorySetting from '@/components/settings/CategorySetting.vue'
import {rootStoreModule} from "@/store";
import Schedule, {cloneSchedule} from "@/Models/Schedule";
import {NavPropertyCloneOption} from "@/utils";

@Component({
  components: {
      TimeSetting,
      StorageSetting,
      CategorySetting
  }
})
export default class SettingsComponent extends Vue {
    private scheduleCopy: Schedule|null = null;

    get storeContext() {
        return rootStoreModule.context(this.$store);
    }

    get currentSchedule() {
        return this.storeContext.state.schedule;
    }

    @Watch("currentSchedule")
    onCurrentScheduleChanged() {
        this.scheduleCopy = cloneSchedule(this.currentSchedule,
            NavPropertyCloneOption.SetNull,
            NavPropertyCloneOption.Clone,
            NavPropertyCloneOption.SetNull
        );

        this.scheduleCopy.defaultTaskType = this.scheduleCopy.taskTypes!
            .find(x => x.id === this.scheduleCopy!.defaultTaskTypeId)!
    }

    created() {
        this.onCurrentScheduleChanged()
    }

    private saveSettings() {
        this.storeContext.actions.updateSchedule(this.scheduleCopy!)
        this.$emit('close')
    }
}
</script>
<style scoped>
    .dialog-name p{
        font-size: 2em;
    }
    .setting-list button{
        display: block;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1em;
        color: #2c6eb7;
        margin-bottom: 10px;
    }
    .setting-list button:hover{
        text-decoration: underline;
    }
    .setting-actions button{
        width: 100%;
    }
</style>