import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TaskNodeData } from '../../../types/workflow';

interface Props {
    data: TaskNodeData;
    onChange: (data: Partial<TaskNodeData>) => void;
}

const TaskNodeForm = ({ data, onChange }: Props) => {
    const { register, watch, reset } = useForm({
        defaultValues: {
            label: data.label,
            description: data.description,
            assignee: data.assignee,
            dueDate: data.dueDate,
        },
    });

    // Reset form when data changes (e.g., when selecting a different node)
    useEffect(() => {
        reset({
            label: data.label,
            description: data.description,
            assignee: data.assignee,
            dueDate: data.dueDate,
        });
    }, [data, reset]);

    useEffect(() => {
        const subscription = watch((value) => {
            onChange(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    {...register('label', { required: true })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    {...register('description')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    rows={3}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <input
                    {...register('assignee')}
                    placeholder="e.g. john.doe@example.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                    type="date"
                    {...register('dueDate')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
        </div>
    );
};

export default TaskNodeForm;
