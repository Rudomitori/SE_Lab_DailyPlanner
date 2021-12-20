<template>
    <div>
        <b-field horizontal label="Имя расписания" label-position="on-border">
            <b-input v-model="schedule.name" />
        </b-field>
        <b-field horizontal label="Начало дня">
            <b-input type="time" v-model="dayBegin" :max="dayEnd"/>
        </b-field>
        <b-field horizontal label="Конец дня">
            <b-input type="time" v-model="dayEnd" :min="dayBegin"/>
        </b-field>
        <b-field horizontal label="Промежуток">
            <b-input type="time" v-model="segmentLength" min="00:15" :max="maxSegmentLength" step="900"/>
        </b-field>
    </div>
</template>
<script lang="ts">
import {Component, VModel, Vue} from "vue-property-decorator";
import Schedule from "@/Models/Schedule";
import moment, {Duration} from "moment";

const timePartFormatter = Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
});

@Component
export default class ScheduleSetting extends Vue {
    @VModel({required: true})
    readonly schedule!: Schedule;

    private durationToStr(dur: Duration) {
        return `${timePartFormatter.format(dur.hours())}:${timePartFormatter.format(dur.minutes())}`
    }

    private get dayBegin() {
        return this.durationToStr(this.schedule.dayBegin);
    }

    private set dayBegin(str: string) {
        this.schedule.dayBegin = moment.duration(str);
    }

    private get dayEnd() {
        return this.durationToStr(this.schedule.dayEnd);
    }

    private set dayEnd(str: string) {
        this.schedule.dayEnd = moment.duration(str);
    }

    private get segmentLength() {
        return this.durationToStr(this.schedule.segmentLength);
    }

    private set segmentLength(str: string) {
        this.schedule.segmentLength = moment.duration(str);
    }

    private get maxSegmentLength() {
        const diff = this.schedule.dayEnd.clone().subtract(this.schedule.dayBegin);
        if(diff.asMilliseconds() < 0) return undefined;
        return this.durationToStr(diff);
    }
}
</script>
<style scoped>
    .title{
        font-size: 1.1em;
        margin-bottom: 20px;
    }
</style>