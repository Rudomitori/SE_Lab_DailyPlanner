<template>
    <div class="is-flex is-flex-direction-column box">
        <!--Кнопка настройки-->
        <b-button expanded type="is-ghost" @click="openSettings">Настройки</b-button>

        <!--#region Навигация по неделям-->
        <b-field class="w-100">
            <p class="control">
                <b-button @click="openPrevWeek">{{'<'}}</b-button>
            </p>
            <p class="control is-fullwidth is-expanded">
                <b-button @click="openCurrentWeek" expanded>Текущая</b-button>
            </p>
            <p class="control">
                <b-button @click="openNextWeek">{{'>'}}</b-button>
            </p>
        </b-field>
        <!--#endregion-->

        <!--#region Кнопка сохранения-->
        <b-field class="w-100">
            <p class="control is-fullwidth is-expanded">
                <b-button label="Сохранить" expanded type="is-info" :outlined="!hasChanges" @click="saveByLastMethod"/>
            </p>
            <p class="control">
                <b-dropdown position="is-bottom-left">
                    <template #trigger>
                        <b-button type="is-info" :outlined="!hasChanges">
                            <fa-icon icon="plus"/>
                        </b-button>
                    </template>

                    <b-dropdown-item @click="openLocalSavingModal">
                        Сохранить в браузере
                    </b-dropdown-item>
                    <b-dropdown-item @click="saveScheduleToFile">
                        Сохранить в файл
                    </b-dropdown-item>
                </b-dropdown>
            </p>
        </b-field>
        <!--#endregion-->

        <!--#region Кнопка загрузки-->
        <b-field class="w-100">
            <p class="control is-fullwidth is-expanded">
                <b-button label="Загрузить" expanded type="is-info" @click="loadByLastMethod"/>
            </p>
            <p class="control">
                <b-dropdown position="is-bottom-left">
                    <template #trigger>
                        <b-button type="is-info">
                            <fa-icon icon="plus"/>
                        </b-button>
                    </template>

                    <b-dropdown-item @click="openLocalSavingModal">
                        Загрузить из браузера
                    </b-dropdown-item>
                    <b-dropdown-item @click="loadScheduleFromFile">
                        Загрузить из файла
                    </b-dropdown-item>
                </b-dropdown>
            </p>
        </b-field>
        <!--#endregion-->
        <slot/>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Emit} from "vue-property-decorator";
import {ModalProgrammatic} from "buefy";
import {rootStoreModule} from "@/store";
import SettingsComponent from '@/components/settings/SettingsComponent.vue'
import LocalSaveLoadCard from "@/components/LocalSaveLoadCard.vue";
import {StorageTypes} from "@/Models/AppSettings";

@Component
export default class ControlSidebar extends Vue {
    get storeContext() {
        return rootStoreModule.context(this.$store);
    }

    openSettings() {
        ModalProgrammatic.open({
            parent: this,
            component: SettingsComponent
        })
    }

    get hasChanges() {
        return rootStoreModule.context(this.$store)
            .state.hasNotSavedChanges
    }

    saveByLastMethod() {
        const appSettings = this.storeContext.state.appSettings;
        switch (appSettings.lastStorageType) {
            case StorageTypes.Local:
                if(appSettings.lastLocalStorageKey !== null)
                    this.storeContext.actions.saveScheduleToLocalStorage(appSettings.lastLocalStorageKey)
                else
                    this.openLocalSavingModal()
                break;
            case StorageTypes.File:
                this.storeContext.actions.saveScheduleToFile()
        }
    }

    loadByLastMethod() {
        const appSettings = this.storeContext.state.appSettings;
        switch (appSettings.lastStorageType) {
            case StorageTypes.Local:
                if(appSettings.lastLocalStorageKey !== null)
                    this.storeContext.actions.loadScheduleFromLocalStorage(appSettings.lastLocalStorageKey)
                else
                    this.openLocalSavingModal()
                break;
            case StorageTypes.File:
                this.storeContext.actions.loadScheduleFromFile();
        }
    }

    openLocalSavingModal() {
        ModalProgrammatic.open({
            parent: this,
            component: LocalSaveLoadCard
        })
    }

    saveScheduleToFile() {
        this.storeContext.actions.saveScheduleToFile()
    }

    loadScheduleFromFile() {
        this.storeContext.actions.loadScheduleFromFile()
    }

    @Emit()
    openNextWeek() {}

    @Emit()
    openPrevWeek() {}

    @Emit()
    openCurrentWeek() {}
}
</script>

<style scoped>

</style>