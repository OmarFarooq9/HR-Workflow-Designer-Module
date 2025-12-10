import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EndNodeData } from '../../../types/workflow';

interface Props {
    data: EndNodeData;
    onChange: (data: Partial<EndNodeData>) => void;
}

const EndNodeForm = ({ data, onChange }: Props) => {
    const { register, watch, reset } = useForm({
        defaultValues: {
            label: data.label,
            endMessage: data.endMessage,
            isSummary: data.isSummary,
        },
    });

    // Reset form when data changes (e.g., when selecting a different node)
    useEffect(() => {
        reset({
            label: data.label,
            endMessage: data.endMessage,
            isSummary: data.isSummary,
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
                    {...register('label')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">End Message</label>
                <textarea
                    {...register('endMessage')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    rows={3}
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register('isSummary')}
                    id="isSummary"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isSummary" className="text-sm font-medium">Show Summary</label>
            </div>
        </div>
    );
};

export default EndNodeForm;
