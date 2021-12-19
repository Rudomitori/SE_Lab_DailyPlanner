import Schedule, {cloneSchedule} from "@/Models/Schedule";
import AppSettings from "@/Models/AppSettings";
import {cloneTask} from "@/Models/Task";
import {cloneTaskType} from "@/Models/TaskType";
import moment from "moment";

export const localStorageService = {
    saveSchedule(schedule: Schedule, saveName: string) {
        const clonedSchedule = cloneSchedule(schedule);
        clonedSchedule.tasks = schedule.tasks!.map(x => cloneTask(x));
        clonedSchedule.taskTypes = schedule.taskTypes!.map(x => cloneTaskType(x));
        localStorage.setItem("__" + saveName, JSON.stringify(clonedSchedule));
    },

    loadSchedule(key: string): Schedule {
        const item = localStorage.getItem("__" + key)!
        const schedule = JSON.parse(item);
        schedule.dayBegin = moment.duration(schedule.dayBegin)
        schedule.dayEnd = moment.duration(schedule.dayEnd)
        schedule.segmentLength = moment.duration(schedule.segmentLength)
        for (const task of schedule.tasks) {
            task.begin = moment(task.begin)
            task.end = moment(task.end)
        }

        return schedule as Schedule
    },

    loadAppSettings() {
        const item = localStorage.getItem('appSettings');
        return item === null ? null : JSON.parse(item) as AppSettings
    },

    saveAppSettings(settings: AppSettings) {
        localStorage.setItem("appSettings", JSON.stringify(settings))
    },

    getSavedScheduleInfo() {
        const infoArr = [] as {key: string, name: string}[]
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            if(key.startsWith("__")) {
                const item = localStorage.getItem(key)!;
                const schedule = JSON.parse(item) as Schedule;
                infoArr.push({key: key.slice(2), name: schedule.name})
            }
        }
        return infoArr
    },

    removeSchedule(key: string) {
        localStorage.removeItem("__" + key);
    }
}