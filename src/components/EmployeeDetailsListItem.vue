<template>
    <div
        :class="{ 'list-group-item': true, 'list-group-item-warning': required && !value, 'list-group-item-danger': !validator(value), }">

        <div v-if="!editable">
            <span>{{ name }}: {{ internalValue }}</span>
        </div>

        <div v-if="editable && !editing" class="d-flex justify-content-between align-items-center">
            <span>{{ name }}: {{ internalValue }}</span>
            <button type="button" class="btn btn-primary" @click="onClickEdit">Edit</button>
        </div>

        <div v-if="editable && editing" class="d-flex flex-wrap justify-content-between align-items-center">
            <span>{{ name }}: </span>
            <div class="btn-group">
                <button type="button" class="btn btn-success" @click="onClickSave">Save</button>
                <button type="button" class="btn btn-danger" @click="onClickCancel">Cancel</button>
            </div>
            <div class="w-100">
                <input v-if="type === 'DATE'" type="date" v-model="internalValue" :required="required"
                    :class="{ 'is-invalid': !validator(internalValue) }" :min="minimumValue" :max="maximumValue">
            </div>
        </div>

    </div>
</template>

<script lang="ts">
/**
 * Usage:
 * 
 * <EmployeeDetailsListItem
 *     name="First Name"
 *     value="John"
 *     required
 *     editable
 *     type="text"
 *     :validator="value => value.length > 0"
 * />
 * 
 * This will render an editable list item with the label "First Name" and the initial value "John".
 * The `required` prop indicates that the field is required.
 * The `editable` prop allows the field to be edited.
 * The `type` prop specifies the type of the input field (in this case, a text field).
 * The `validator` prop is a function that checks if the input value is valid (in this case, it checks if the value is not empty).
 */
export default {
    props: {
        name: {
            type: String,
        },
        value: {
            type: String,
        },
        required: {
            type: Boolean,
            default: false,
        },
        editable: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
        },
        minimumValue: {
            type: String,
            required: false,
        },
        maximumValue: {
            type: String,
            required: false,
        },
        validator: {
            type: Function,
            default: () => true,
        },
    },
    data() {
        return {
            editing: false,
            internalValue: this.value,
        }
    },
    methods: {
        /**
         * Handles the click event of the edit button.
         * Sets the component to editing mode and copies the current value to the internal value.
         */
        onClickEdit(): void {
            this.editing = true;
            this.internalValue = this.value;
        },
        /**
         * Handles the click event of the save button.
         * Exits editing mode and emits the 'onEditValue' event with the internal value.
         */
        onClickSave(): void {
            this.editing = false;
            this.$emit('onEditValue', this.internalValue);
        },
        /**
         * Handles the click event of the cancel button.
         * Exits editing mode and resets the internal value to the current value.
         */
        onClickCancel(): void {
            this.editing = false;
            this.internalValue = this.value;
        },
    }
};
</script>