<template>
    <div class="buttons is-flex is-flex-direction-column">
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
        <b-field class="mt-auto w-100">
            <p class="control is-fullwidth is-expanded">
                <b-button label="Сохранить" expanded type="is-info" :disabled="!hasChanges" @click="saveChanges"/>
            </p>
            <p class="control">
                <b-dropdown position="is-bottom-left" :disabled="!hasChanges">
                    <template #trigger>
                        <b-button type="is-info">
                            <fa-icon icon="plus"/>
                        </b-button>
                    </template>

                    <b-dropdown-item v-for="settings of storageSettings" @click="saveChanges(settings.id)">
                        {{ settings.name }}
                    </b-dropdown-item>
                </b-dropdown>
            </p>
        </b-field>
        <!--#endregion-->

        <!--#region Кнопка загрузки-->
        <b-field class="w-100">
            <p class="control is-fullwidth is-expanded">
                <b-button label="Загрузить" expanded type="is-info" @click="loadSchedule"/>
            </p>
            <p class="control">
                <b-dropdown position="is-bottom-left">
                    <template #trigger>
                        <b-button type="is-info">
                            <fa-icon icon="plus"/>
                        </b-button>
                    </template>

                    <b-dropdown-item v-for="settings of storageSettings" @click="loadSchedule(settings.id)">
                        {{ settings.name }}
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

@Component
export default class ControlSidebar extends Vue {
    openSettings() {
        /*SnackbarProgrammatic.open({
            message: "Раздел настроек ещё не реализован",
            type: 'is-warning',
            position: 'is-top',
        });*/
        ModalProgrammatic.open({
            parent: this,
            component: SettingsComponent
        })
    }

    async saveChanges(settingsId?: string) {
        try {
            await rootStoreModule.context(this.$store)
                .actions.saveSchedule({settingsId})
        } catch (e: any) {
            if(e instanceof Error) {
                SnackbarProgrammatic.open({
                    message: e.message,
                    type: 'is-warning',
                    position: 'is-top',
                })
            }
        }
    }

    async loadSchedule(settingsId?: string) {
        try {
            await rootStoreModule.context(this.$store)
                .actions.loadSchedule({settingsId})
        } catch (e: any) {
            if(e instanceof Error) {
                SnackbarProgrammatic.open({
                    message: e.message,
                    type: 'is-warning',
                    position: 'is-top',
                })
            }
        }
    }

    get hasChanges() {
        return rootStoreModule.context(this.$store)
            .state.hasNotSavedChanges
    }

    get storageSettings() {
        return rootStoreModule.context(this.$store)
            .state.appSettings.storageSettingsArray
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