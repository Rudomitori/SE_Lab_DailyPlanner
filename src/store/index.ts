import {Actions, createStore, Getters, Module, Mutations} from "vuex-smart-module";
import Schedule from "@/Models/Schedule";
import AppSettings, {StorageTypes} from "@/Models/AppSettings";
import moment, {Moment} from "moment";
import {v4} from "uuid";
import TaskType from "@/Models/TaskType";
import Task, {cloneTask} from "@/Models/Task";
import Vue from "vue";
import Vuex from 'vuex'
import localStorageService from "@/storages/localStorageService";
import fileStorageService from "@/storages/fileStorageService";
import {NavPropertyCloneOption} from "@/utils";

class RootStoreState {
    hasNotSavedChanges: boolean = false;
    schedule: Schedule;
    appSettings: AppSettings;

    constructor() {
        const defaultTaskTypeId = v4();

        const defaultTaskType: TaskType = {
            id: defaultTaskTypeId,
            name: "Тип задачи по умолчанию",
            colors: ['#464646', '#FFFFFF'],
            font: "Aria",
            priority: 10
        };

        const firstTask: Task = {
            id: v4(),
            typeId: defaultTaskTypeId,
            name: "Первичная настройка",
            description: "Потыкать интерфейс. Создать типы задачь и сами задачи",
            begin: moment(),
            end: moment().add(1, 'hour'),
            isDone: false,
            taskType: defaultTaskType
        };

        this.schedule = {
            name: "Новое расписание",
            dayBegin: moment.duration(8, 'hours'),
            dayEnd: moment.duration(20, 'hour'),
            segmentLength: moment.duration(1, 'hour'),
            defaultTaskTypeId,
            taskTypes: [defaultTaskType],
            tasks: [firstTask],
            defaultTaskType
        };

        this.appSettings = localStorageService.loadAppSettings() || {
            lastLocalStorageKey: null,
            lastStorageType: StorageTypes.Local
        };
    }
}

class RootStoreGetters extends Getters<RootStoreState> {
    get tasks() {
        return this.state.schedule.tasks!;
    }

    get taskTypes() {
        return this.state.schedule.taskTypes!;
    }

    get defaultTaskType() {
        return this.state.schedule.defaultTaskType!
    }
}

class RootStoreMutations extends Mutations<RootStoreState> {
    addTasks(tasks: Task[]) {
        for (const task of tasks) {
            this.state.schedule.tasks!.push(task);
            this.state.hasNotSavedChanges = true;
        }
    }

    removeTask({taskId}: {taskId: string}) {
        const taskIndex = this.state.schedule.tasks!.findIndex(x => x.id === taskId);

        if(taskIndex === -1) throw new Error();

        this.state.schedule.tasks!.splice(taskIndex, 1);
        this.state.hasNotSavedChanges = true;
    }

    updateTask(task: Task) {
        const taskIndex = this.state.schedule.tasks!.findIndex(x => x.id === task.id);

        if(taskIndex === -1) throw new Error();

        this.state.schedule.tasks!.splice(taskIndex, 1, task);
        this.state.hasNotSavedChanges = true;
    }

    updateSchedule(schedule: Schedule) {
        const oldSchedule = this.state.schedule;
        schedule.tasks ||= oldSchedule.tasks
        schedule.taskTypes ||= oldSchedule.taskTypes
        schedule.defaultTaskType = schedule.taskTypes!.find(x => x.id === schedule.defaultTaskTypeId)!
        for (const task of schedule.tasks!) {
            task.taskType = schedule.taskTypes!.find(x => x.id === task.typeId)!
        }
        this.state.schedule = schedule
        this.state.hasNotSavedChanges = true
    }

    setNoChanges() {
        this.state.hasNotSavedChanges = false;
    }

    updateAppSettings(settings: AppSettings) {
        this.state.appSettings = settings
    }
}

class RootStoreActions extends Actions<RootStoreState, RootStoreGetters, RootStoreMutations, RootStoreActions> {
    createTask({name, begin, end}: {name: string, begin: Moment, end: Moment}) {
        const defaultTaskType = this.getters.defaultTaskType

        const newTask: Task = {
            id: v4(),
            typeId: defaultTaskType.id,
            name,
            begin,
            end,
            taskType: defaultTaskType,
            isDone: false,
            description: null
        }

        this.mutations.addTasks([newTask])
    }

    updateTask(task: Task) {
        this.mutations.updateTask(task)
    }

    $init() {
        const appSettings = this.state.appSettings;
        switch (appSettings.lastStorageType){
            case StorageTypes.Local:
                const key = appSettings.lastLocalStorageKey;
                if(key !== null)
                    this.actions.loadScheduleFromLocalStorage(key)
                break;
            // File chooser dialog can only be shown with a user activation
            // case StorageTypes.File:
            //     this.actions.loadScheduleFromFile()
        }
    }

    removeTask(taskId: string) {
        this.mutations.removeTask({taskId});
    }

    markTaskAsDone({taskId, isDone}: {taskId: string, isDone: boolean}) {
        const task = this.state.schedule.tasks!.find(x => x.id === taskId);

        if(!task) throw new Error();

        task.isDone = isDone;
        this.mutations.updateTask(task);
    }

    updateSchedule(schedule: Schedule) {
        this.mutations.updateSchedule(schedule)
    }

    updateAppSettings(settings: AppSettings) {
        this.mutations.updateAppSettings(settings)

        localStorageService.saveAppSettings(settings)
    }

    duplicateTask({taskId, prevCount, nextCount}: {taskId: string, prevCount: number, nextCount: number}) {
        const sourceTask = this.getters.tasks.find(x => x.id === taskId)!;
        const newTasks = [] as Task[]
        for (let i = 0; i < prevCount; i++) {
            const clonedTask = cloneTask(sourceTask, NavPropertyCloneOption.Include);
            clonedTask.begin.subtract(i + 1, 'week');
            clonedTask.end.subtract(i + 1, 'week')
            newTasks.push(clonedTask);
        }
        for (let i = 0; i < nextCount; i++) {
            const clonedTask = cloneTask(sourceTask, NavPropertyCloneOption.Include);
            clonedTask.begin.add(i + 1, 'week');
            clonedTask.end.add(i + 1, 'week')
            newTasks.push(clonedTask);
        }

        this.mutations.addTasks(newTasks);
    }

    //#region LocalStorage

    loadScheduleFromLocalStorage(key: string) {
        const schedule = localStorageService.loadSchedule(key)
        this.mutations.updateSchedule(schedule)

        this.mutations.setNoChanges()
        this.actions.updateAppSettings({
            lastLocalStorageKey: key,
            lastStorageType: StorageTypes.Local
        })
    }

    saveScheduleToLocalStorage(key: string) {
        localStorageService.saveSchedule(this.state.schedule, key)

        this.mutations.setNoChanges()
        this.actions.updateAppSettings({
            lastLocalStorageKey: key,
            lastStorageType: StorageTypes.Local
        })
    }

    removeScheduleFromLocalStorage(key: string) {
        localStorageService.removeSchedule(key)
        if(this.state.appSettings.lastLocalStorageKey === key)
            this.actions.updateAppSettings({
                lastLocalStorageKey: null,
                lastStorageType: this.state.appSettings.lastStorageType
            })
    }

    saveScheduleToFile() {
        fileStorageService.saveSchedule(this.state.schedule)

        this.mutations.setNoChanges();
        this.actions.updateAppSettings({
            lastLocalStorageKey: this.state.appSettings.lastLocalStorageKey,
            lastStorageType: StorageTypes.File
        })
    }

    async loadScheduleFromFile() {
        const schedule = await fileStorageService.loadSchedule();
        if(!schedule) return;
        this.mutations.updateSchedule(schedule)

        this.mutations.setNoChanges()
        this.actions.updateAppSettings({
            lastLocalStorageKey: this.state.appSettings.lastLocalStorageKey,
            lastStorageType: StorageTypes.File
        })

    }

    //#endregion
}

export const rootStoreModule = new Module({
    state: RootStoreState,
    getters: RootStoreGetters,
    mutations: RootStoreMutations,
    actions: RootStoreActions
});

Vue.use(Vuex);
export const store = createStore(rootStoreModule);
