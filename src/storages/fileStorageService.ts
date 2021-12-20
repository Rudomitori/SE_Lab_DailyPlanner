import Schedule, {cloneSchedule} from "@/Models/Schedule";
import {cloneTask} from "@/Models/Task";
import {cloneTaskType} from "@/Models/TaskType";
import moment from "moment";
import {openFileChooseWindow, saveBlobAsFile} from "@/utils";

const fileStorageService = {
    saveSchedule(schedule: Schedule) {
        const clonedSchedule = cloneSchedule(schedule);
        clonedSchedule.tasks = schedule.tasks!.map(x => cloneTask(x));
        clonedSchedule.taskTypes = schedule.taskTypes!.map(x => cloneTaskType(x));

        const json = JSON.stringify(clonedSchedule);
        const blob = new Blob([json], {
            type: 'text/plain'
        });

        saveBlobAsFile(blob, `${clonedSchedule.name}.json`);
    },

    async loadSchedule(): Promise<Schedule | null> {
        const file = await openFileChooseWindow();
        if (!file) return null;

        return new Promise((resolve => {
            const reader = new FileReader();
            reader.readAsText(file, "UTF8")
            reader.onload = () => {
                const text = reader.result as string;
                const schedule = JSON.parse(text);

                schedule.dayBegin = moment.duration(schedule.dayBegin)
                schedule.dayEnd = moment.duration(schedule.dayEnd)
                schedule.segmentLength = moment.duration(schedule.segmentLength)
                for (const task of schedule.tasks) {
                    task.begin = moment(task.begin)
                    task.end = moment(task.end)
                }

                resolve(schedule as Schedule)
            }
        }))

    },
}

export default fileStorageService;