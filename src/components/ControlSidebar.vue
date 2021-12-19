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
                <b-button label="Сохранить" expanded type="is-info" :disabled="!hasChanges" @click="saveByLastMethod"/>
            </p>
            <p class="control">
                <b-dropdown position="is-bottom-left" :disabled="!hasChanges">
                    <template #trigger>
                        <b-button type="is-info">
                            <fa-icon icon="plus"/>
                        </b-button>
                    </template>

                    <b-dropdown-item @click="openLocalSavingModal">
                        Сохранить в браузере
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
                </b-dropdown>
            </p>
        </b-field>
        <!--#endregion-->
    </div>
</template>

<script lang="ts">
import {Component, Vue, Emit} from "vue-property-decorator";
import {SnackbarProgrammatic, ModalProgrammatic} from "buefy";
import {rootStoreModule} from "@/store";
import SettingsComponent from '@/components/settings/SettingsComponent.vue'
import LocalSaveLoadCard from "@/components/LocalSaveLoadCard.vue";
import {StorageTypes} from "@/Models/AppSettings";
import {localStorageService} from "@/Storages";

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
        }
    }

    openLocalSavingModal() {
        ModalProgrammatic.open({
            parent: this,
            component: LocalSaveLoadCard
        })
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