<template>
    <div>
        <div class="title">
            <p>Настройки времени</p>
        </div>
        <div>
            <b-field horizontal label="Начало дня">
                <b-timepicker v-model="startTime"></b-timepicker>
            </b-field>
            <b-field horizontal label="Конец дня">
                <b-timepicker v-model="endTime"></b-timepicker>
            </b-field>
            <b-field horizontal label="Промежуток">
                <b-timepicker v-model="intervalTime"></b-timepicker>
            </b-field>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
@Component
export default class TimeSetting extends Vue{
    private startTime?: Date = new Date(0);
    private endTime?: Date = new Date(0);;
    private intervalTime?: Date = new Date(0);;
}
</script>
<style scoped>
    .timepicker{
        width: 100px;
    }
    .title{
        font-size: 1.1em;
        margin-bottom: 20px;
    }
</style>