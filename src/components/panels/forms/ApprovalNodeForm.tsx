import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ApprovalNodeData } from '../../../types/workflow';

interface Props {
    data: ApprovalNodeData;
    onChange: (data: Partial<ApprovalNodeData>) => void;
}

const ApprovalNodeForm = ({ data, onChange }: Props) => {
    const { register, watch, reset } = useForm({
        defaultValues: {
            label: data.label,
            approverRole: data.approverRole,
            autoApproveThreshold: data.autoApproveThreshold,
        },
    });

    // Reset form when data changes (e.g., when selecting a different node)
    useEffect(() => {
        reset({
            label: data.label,
            approverRole: data.approverRole,
            autoApproveThreshold: data.autoApproveThreshold,
        });
    }, [data, reset]);

    useEffect(() => {
        const subscription = watch((value) => {
            onChange({
                ...value,
                autoApproveThreshold: value.autoApproveThreshold ? Number(value.autoApproveThreshold) : undefined
            });
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
                <label className="block text-sm font-medium mb-1">Approver Role</label>
                <select
                    {...register('approverRole')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                    <option value="">Select Role</option>
                    <option value="Manager">Manager</option>
                    <option value="HRBP">HRBP</option>
                    <option value="Director">Director</option>
                    <option value="VP">VP</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Auto-approve Threshold ($)</label>
                <input
                    type="number"
                    {...register('autoApproveThreshold')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
        </div>
    );
};

export default ApprovalNodeForm;
