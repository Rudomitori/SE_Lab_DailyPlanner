<template>
    <div>
        <b-button icon-left="plus" type="is-info is-light" @click="newCategory"/>
        <div>
            <b-table :data='taskTypes'>
                <b-table-column field="name" label="Название" sortable v-slot="props" :td-attrs="nameColumnAttrGetter">
                    <span>
                        {{ props.row.name }}
                    </span>
                </b-table-column>
                <b-table-column field="priority" label="Приоритет" sortable v-slot="props">
                    {{ props.row.priority }}
                </b-table-column>
                <b-table-column width="80" v-slot="props">
                    <b-icon
                        pack="fas"
                        icon="edit"
                        style="cursor:pointer;"
                        @click.native="editCategory(props.row.id)"
                        size="is-little"></b-icon>
                    <b-icon
                        type="is-danger"
                        pack="fas"
                        icon="trash-alt"
                        style="margin-left:5px; cursor:pointer;"
                        @click.native="removeCategory(props.row.id)"
                        size="is-little"></b-icon>
                </b-table-column>
            </b-table>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, VModel, Vue} from "vue-property-decorator";
import {ModalProgrammatic} from "buefy";
import EditCategoryComponent from '@/components/settings/EditCatoryComponent.vue'
import TaskType from "@/Models/TaskType";
import {v4} from "uuid";

@Component
export default class TimeSetting extends Vue {
    @VModel({required: true, type: Array})
    readonly taskTypes!: TaskType[];

    private editCategory(id: string) {
        ModalProgrammatic.open({
            parent: this,
            component: EditCategoryComponent,
            props: {
                value: this.taskTypes.find(x => x.id === id)!
            },
        })
    }

    private newCategory() {
        const newTaskType: TaskType = {
            id: v4(),
            name: "Новый тип задачи",
            colors: ["#323232", "#F0F0F0"],
            font: "sans-serif",
            priority: 0
        }

        this.taskTypes.push(newTaskType)

        this.editCategory(newTaskType.id)
    }

    private removeCategory(id: string) {
        const index = this.taskTypes.findIndex(x => x.id === id);
        this.taskTypes.splice(index, 1);
    }

    private nameColumnAttrGetter(row: any) {
        return {
            style: {
                color: row.colors[1], backgroundColor: row.colors[0]
            }
        }
    }
}
</script>