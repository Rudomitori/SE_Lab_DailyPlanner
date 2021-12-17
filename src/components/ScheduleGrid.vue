<template>
    <div class="is-flex is-flex-direction-column h-100">
        <h3 class="is-size-3">{{scheduleName}}</h3>
        <div class="is-flex-grow-1 is-flex-shrink-1 h-100 w-100 has-background-grey schedule-grid" :style="gridStyles">
            <!--Дата-->
            <div class="has-background-primary-dark has-text-white h-100 w-100 day-label has-dashed-border"
                 v-for="label of dayLabels"
                 :style="label.gridPosition">
                {{label.text}}
            </div>

            <!--Время-->
            <div class="has-background-info-dark has-text-white h-100 w-100 day-label has-dashed-border"
                 v-for="label of timeLabels"
                 :style="label.gridPosition">
                {{label.text}}
            </div>

            <!-- Пустые ячейки -->
            <div class="has-background-warning h-100 w-100 has-dashed-border" v-for="cell of emptyCellDisplayVms"
                 :style="cell.gridPosition" @click="onEmptyCellClick(cell)">
            </div>

            <!-- Задачи -->
            <div class="has-background-danger-dark has-text-white h-100 w-100 task-cell" v-for="vm of taskDisplayVms"
                 :style="vm.gridPosition">
                <b-checkbox size="is-small" :value="vm.isDone" @input="markTaskAsDone(vm.id, $event)"/>
                <span class="truncated-text" :title="vm.name">
                    {{vm.name}}
                </span>
                <div class="task-action-container">
                    <fa-icon icon="times-circle" size="xs" @click="removeTask(vm.id)"/>
                    <fa-icon icon="edit" size="xs" @click="openTaskEditorModal(vm.id)"/>
                </div>
            </div>

            <div class="has-background-warning h-100 w-100 has-dashed-border day-label" v-if="editedCellDisplayVm"
                 :style="editedCellDisplayVm.gridPosition">
                <b-input v-model="editedCellDisplayVm.value" size="is-small"
                         @keypress.enter.native="onEditedCellEndInput"
                         @keypress.esc.native="cancelTaskCreating"
                         @blur="cancelTaskCreating"
                         ref="editedCellInput">
                </b-input>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import {ModalProgrammatic} from "buefy";
import moment, {Duration, Moment} from "moment";
import {rootStoreModule} from "@/store";
import {delay} from "@/utils";
import TaskEditorCard from "@/components/TaskEditorCard.vue";

interface GridPosition {
    'grid-column-start': number,
    'grid-column-end': number,
    'grid-row-start': number,
    'grid-row-end': number
}

interface EmptyCellDisplayVm {
    date: Moment, time: Duration,
    row: number, column: number,
    gridPosition: GridPosition
}

interface EditedCellDisplayVm extends EmptyCellDisplayVm {
    value: string
}

@Component
export default class ScheduleGrid extends Vue {
    get storeContext() {
        return rootStoreModule.context(this.$store);
    }

    get scheduleName() {
        return this.storeContext
            .state.schedule.name;

    }

    get taskOfSelectedWeek() {
        const begin = this.dateInSelectedWeek.clone().startOf('isoWeek');
        const end = this.dateInSelectedWeek.clone().endOf('isoWeek');
        const tasks = this.storeContext.getters.tasks;

        return tasks.filter(x =>
            x.begin.diff(begin) >= 0 && x.begin.diff(end) <= 0
            || x.end.diff(begin) >= 0 && x.end.diff(end) <= 0
        );
    }

    get segmentsPerDay() {
        const context = this.storeContext;

        const dayBegin = context.state.schedule.dayBegin;
        const dayEnd = context.state.schedule.dayEnd;
        const dayLengthInMs = dayEnd.asMilliseconds() - dayBegin.asMilliseconds();

        const segmentLength = context.state.schedule.segmentLength;
        return dayLengthInMs / segmentLength.asMilliseconds();
    }

    get gridStyles() {
        return {
            "grid-template-columns": "calc(100% / 15) repeat(7, calc(100% / 15 * 2))",
            "grid-template-rows": `repeat(${this.segmentsPerDay + 1}, 1fr)`
        }
    }

    get dayLabels() {
        let day = this.dateInSelectedWeek.clone().startOf('isoWeek');
        const labels = [] as string[];
        for (let i = 0; i < 7; i++) {
            labels.push(day.format('DD.MM.YYYY'));
            day = day.add(1, 'day');
        }
        return labels.map((x, i) => ({
            gridPosition: {
                'grid-column-start': i+2,
                'grid-column-end': i+3,
                'grid-row-start': 1,
                'grid-row-end': 2
            } as GridPosition,
            text: x
        }));
    }

    get emptyCellDisplayVms() {
        const context = this.storeContext;

        const cellData = [] as EmptyCellDisplayVm[];
        let time = context.state.schedule.dayBegin.clone();
        for (let i = 0; i < this.segmentsPerDay; i++) {
            let date = this.dateInSelectedWeek.clone().startOf('isoWeek');
            for (let j = 0; j < 7; j++) {
                cellData.push({
                    date: date.clone(),
                    time: time.clone(),
                    row: i + 2,
                    column: j + 2,
                    gridPosition: {
                        'grid-column-start': j+2,
                        'grid-column-end': j+3,
                        'grid-row-start': i+2,
                        'grid-row-end': i+3
                    }
                })
                date.add(1, 'day')
            }
            time.add(context.state.schedule.segmentLength);
        }
        return cellData;
    }

    get timeLabels() {
        const context = rootStoreModule.context(this.$store);
        const begin = context.state.schedule.dayBegin;
        const segmentLength = context.state.schedule.segmentLength;
        let time = moment().startOf('day').add(begin);

        const labels = [] as string[];
        for (let i = 0; i < this.segmentsPerDay; i++) {
            labels.push(time.format('HH:mm'));
            time = time.add(segmentLength);
        }
        return labels.map((x, i) => ({
            gridPosition: {
                'grid-column-start': 1,
                'grid-column-end': 2,
                'grid-row-start': 2+i,
                'grid-row-end': 3+i
            } as GridPosition,
            text: x
        }));
    }

    get taskDisplayVms() {
        const context = this.storeContext;
        const dayBegin = context.state.schedule.dayBegin.asMilliseconds();
        const segmentLength = context.state.schedule.segmentLength.asMilliseconds();
        const weekBegin = this.dateInSelectedWeek.clone().startOf('isoWeek');

        const map = this.taskOfSelectedWeek.map(x => {
            const rowStart = Math.floor((x.begin.diff(x.begin.clone().startOf('day')) - dayBegin) / segmentLength);
            const rowEnd = Math.floor((x.end.diff(x.end.clone().startOf('day')) - dayBegin) / segmentLength);

            return ({
                name: x.name,
                id: x.id,
                isDone: x.isDone,
                gridPosition: {
                    'grid-column-start': 2 + moment.duration(x.begin.diff(weekBegin)).days(),
                    'grid-column-end': 3 + moment.duration(x.begin.diff(weekBegin)).days(),
                    'grid-row-start': 2 + rowStart,
                    'grid-row-end': 2 + rowEnd
                }
            });
        });
        console.log(map);
        return map;
    }

    //#region Создание задачи

    editedCellDisplayVm: EditedCellDisplayVm | null = null;

    @Ref() editedCellInput!: HTMLInputElement

    async onEmptyCellClick(cellDisplayVm: EmptyCellDisplayVm) {
        if(this.editedCellDisplayVm) return;

        this.editedCellDisplayVm = {
            ...cellDisplayVm,
            value: "Новая задача"
        }

        // Даём управление Vue, чтобы он отрисовал элементы
        await delay(0);
        this.editedCellInput.focus();
    }

    cancelTaskCreating() {
        this.editedCellDisplayVm = null;
    }

    onEditedCellEndInput() {
        const context = this.storeContext;
        const vm = this.editedCellDisplayVm!;
        const begin = vm.date.clone().add(vm.time);
        const end = begin.clone().add(context.state.schedule.segmentLength);
        context.actions.createTask({
            name: vm.value,
            begin, end
        })

        this.editedCellDisplayVm = null;
    }

    //#endregion

    removeTask(taskId: string, force: boolean = false) {
        // Todo: Открывать окно подтверждения
        this.storeContext.actions.removeTask(taskId);
    }

    markTaskAsDone(taskId: string, isDone: boolean) {
        this.storeContext.actions.markTaskAsDone({taskId, isDone});
    }

    openTaskEditorModal(taskId: string) {
        ModalProgrammatic.open({
            parent: this,
            component: TaskEditorCard,
            props: { taskId }
        })
    }

    private dateInSelectedWeek = moment();

    //#region Нафигация по неделям

    public openCurrentWeek() {
        this.dateInSelectedWeek = moment()
    }

    public openPrevWeek() {
        this.dateInSelectedWeek = this.dateInSelectedWeek.clone()
            .subtract(1, 'week')
    }

    public openNextWeek() {
        this.dateInSelectedWeek = this.dateInSelectedWeek.clone()
            .add(1, 'week')
    }

    //#endregion
}
</script>

<style lang="scss">
.schedule-grid {
    display: grid;
}

.day-label {
    display: flex;
    align-items: center;
    justify-content: center;
}

.task-cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0.25em;

    > * {
        margin: 0.25em;
    }

    label.checkbox {
        span.control-label {
            padding: 0;
        }
    }

    .task-action-container {
        height: 100%;

        margin-left: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
}
</style>