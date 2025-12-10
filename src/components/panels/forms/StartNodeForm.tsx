import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StartNodeData } from '../../../types/workflow';

interface Props {
    data: StartNodeData;
    onChange: (data: Partial<StartNodeData>) => void;
}

const StartNodeForm = ({ data, onChange }: Props) => {
    const { register, watch, reset } = useForm({
        defaultValues: {
            label: data.label,
        },
    });

    // Reset form when data changes (e.g., when selecting a different node)
    useEffect(() => {
        reset({
            label: data.label,
        });
    }, [data, reset]);

    // Watch for changes and propagate up
    useEffect(() => {
        const subscription = watch((value) => {
            onChange({ label: value.label });
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                    {...register('label')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>
            <div className="text-xs text-muted-foreground">
                Configure the entry point for this workflow.
            </div>
        </div>
    );
};

export default StartNodeForm;
