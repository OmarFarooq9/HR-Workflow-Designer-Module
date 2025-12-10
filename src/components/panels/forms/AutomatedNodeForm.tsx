import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AutomatedNodeData, AutomationAction } from '../../../types/workflow';
import { getAutomations } from '../../../api/mockApi';

interface Props {
    data: AutomatedNodeData;
    onChange: (data: Partial<AutomatedNodeData>) => void;
}

const AutomatedNodeForm = ({ data, onChange }: Props) => {
    const [actions, setActions] = useState<AutomationAction[]>([]);
    const [paramValues, setParamValues] = useState<Record<string, string>>(
        (data.actionParams as Record<string, string>) || {}
    );
    const { register, watch, reset } = useForm({
        defaultValues: {
            label: data.label,
            actionId: data.actionId,
        },
    });

    useEffect(() => {
        getAutomations().then(setActions);
    }, []);

    // Reset form when data changes (e.g., when selecting a different node)
    useEffect(() => {
        reset({
            label: data.label,
            actionId: data.actionId,
        });
        setParamValues((data.actionParams as Record<string, string>) || {});
    }, [data, reset]);

    useEffect(() => {
        const subscription = watch((value) => {
            onChange({ ...value, actionParams: paramValues });
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange, paramValues]);

    const selectedAction = actions.find(a => a.id === watch('actionId'));

    const handleParamChange = (paramName: string, value: string) => {
        const newParams = { ...paramValues, [paramName]: value };
        setParamValues(newParams);
        onChange({ actionParams: newParams });
    };

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
                <label className="block text-sm font-medium mb-1">Action</label>
                <select
                    {...register('actionId')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                    <option value="">Select Action</option>
                    {actions.map(action => (
                        <option key={action.id} value={action.id}>{action.label}</option>
                    ))}
                </select>
            </div>

            {selectedAction && selectedAction.params.length > 0 && (
                <div className="rounded-md bg-muted p-3">
                    <p className="font-medium text-sm mb-3">Parameters:</p>
                    <div className="space-y-3">
                        {selectedAction.params.map(param => (
                            <div key={param}>
                                <label className="block text-xs font-medium mb-1 text-muted-foreground capitalize">
                                    {param.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                                </label>
                                <input
                                    type="text"
                                    value={paramValues[param] || ''}
                                    onChange={(e) => handleParamChange(param, e.target.value)}
                                    placeholder={`Enter ${param}`}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutomatedNodeForm;

