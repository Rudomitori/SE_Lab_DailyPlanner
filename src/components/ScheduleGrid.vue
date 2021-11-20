<template>
    <b-skeleton active height="100%">

    </b-skeleton>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {SnackbarProgrammatic} from "buefy";
import {Moment} from "moment";

@Component
export default class ScheduleGrid extends Vue {
    public openCurrentWeek() {
        SnackbarProgrammatic.open({
            message: "Переход на текущую неделю не реализован",
            type: 'is-warning',
            position: 'is-top',
        })
    }

    public openPrevWeek() {
        SnackbarProgrammatic.open({
            message: "Переход на предыдущую неделю не реализован",
            type: 'is-warning',
            position: 'is-top',
        })
    }

    public openNextWeek() {
        SnackbarProgrammatic.open({
            message: "Переход на следующую неделю не реализован",
            type: 'is-warning',
            position: 'is-top',
        })
    }

    /**
     * @param date
     * Дата в неделе, которую нужно открыть
     */
    public openWeek(date: Moment) {
        SnackbarProgrammatic.open({
            message: "Переход на определённую неделю не реализован",
            type: 'is-warning',
            position: 'is-top',
        })
    }
}
</script>

<style scoped>

</style>