import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface RuleGroup {
  id: string;
  combinator: 'AND' | 'OR';
  rules: (Rule | RuleGroup)[];
}

interface SegmentBuilderProps {
  onSubmit: (segment: RuleGroup) => void;
  onUpdate?: (segment: RuleGroup) => void;
}

const FIELDS = [
  { value: 'total_spend', label: 'Total Spend (INR)' },
  { value: 'visits', label: 'Number of Visits' },
  { value: 'last_visit', label: 'Last Visit Date' },
  { value: 'inactive_days', label: 'Days Inactive' },
];

const OPERATORS = {
  total_spend: [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '=', label: 'Equal to' },
  ],
  visits: [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '=', label: 'Equal to' },
  ],
  last_visit: [
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' },
  ],
  inactive_days: [
    { value: '>', label: 'More than' },
    { value: '<', label: 'Less than' },
  ],
};

const SegmentBuilder = ({ onSubmit, onUpdate }: SegmentBuilderProps) => {
  const [segment, setSegment] = useState<RuleGroup>({
    id: 'root',
    combinator: 'AND',
    rules: [],
  });

  useEffect(() => {
    if (onUpdate && segment.rules.length > 0) {
      onUpdate(segment);
    }
  }, [segment, onUpdate]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addRule = (parentId: string) => {
    const newRule: Rule = {
      id: generateId(),
      field: FIELDS[0].value,
      operator: OPERATORS[FIELDS[0].value][0].value,
      value: '',
    };

    setSegment((prev) => {
      const updateRules = (group: RuleGroup): RuleGroup => {
        if (group.id === parentId) {
          return { ...group, rules: [...group.rules, newRule] };
        }
        return {
          ...group,
          rules: group.rules.map((rule) =>
            'combinator' in rule ? updateRules(rule) : rule
          ),
        };
      };
      return updateRules(prev);
    });
  };

  const addGroup = (parentId: string) => {
    const newGroup: RuleGroup = {
      id: generateId(),
      combinator: 'AND',
      rules: [],
    };

    setSegment((prev) => {
      const updateRules = (group: RuleGroup): RuleGroup => {
        if (group.id === parentId) {
          return { ...group, rules: [...group.rules, newGroup] };
        }
        return {
          ...group,
          rules: group.rules.map((rule) =>
            'combinator' in rule ? updateRules(rule) : rule
          ),
        };
      };
      return updateRules(prev);
    });
  };

  const updateRule = (ruleId: string, field: string, value: string) => {
    setSegment((prev) => {
      const updateRules = (group: RuleGroup): RuleGroup => {
        return {
          ...group,
          rules: group.rules.map((rule) => {
            if ('combinator' in rule) {
              return updateRules(rule);
            }
            if (rule.id === ruleId) {
              if (field === 'field') {
                return {
                  ...rule,
                  [field]: value,
                  operator: OPERATORS[value][0].value,
                  value: '',
                };
              }
              return { ...rule, [field]: value };
            }
            return rule;
          }),
        };
      };
      return updateRules(prev);
    });
  };

  const deleteRule = (ruleId: string) => {
    setSegment((prev) => {
      const updateRules = (group: RuleGroup): RuleGroup => {
        return {
          ...group,
          rules: group.rules
            .filter((rule) => rule.id !== ruleId)
            .map((rule) => ('combinator' in rule ? updateRules(rule) : rule)),
        };
      };
      return updateRules(prev);
    });
  };

  const deleteGroup = (groupId: string) => {
    setSegment((prev) => {
      const updateRules = (group: RuleGroup): RuleGroup => {
        return {
          ...group,
          rules: group.rules
            .filter((rule) => !('combinator' in rule) || rule.id !== groupId)
            .map((rule) => ('combinator' in rule ? updateRules(rule) : rule)),
        };
      };
      return updateRules(prev);
    });
  };

  const updateCombinator = (groupId: string, value: 'AND' | 'OR') => {
    setSegment((prev) => {
      const updateGroups = (group: RuleGroup): RuleGroup => {
        if (group.id === groupId) {
          return { ...group, combinator: value };
        }
        return {
          ...group,
          rules: group.rules.map((rule) =>
            'combinator' in rule ? updateGroups(rule) : rule
          ),
        };
      };
      return updateGroups(prev);
    });
  };

  const RuleComponent = ({ rule }: { rule: Rule }) => (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <select
        className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        value={rule.field}
        onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
      >
        {FIELDS.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      <select
        className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        value={rule.operator}
        onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
      >
        {OPERATORS[rule.field as keyof typeof OPERATORS].map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      <input
        type={rule.field === 'last_visit' ? 'date' : 'number'}
        className="form-input rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        value={rule.value}
        onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
        placeholder="Enter value"
      />

      <button
        type="button"
        className="p-2 text-red-600 hover:text-red-700 transition-colors"
        onClick={() => deleteRule(rule.id)}
        title="Delete rule"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  const GroupComponent = ({ group, level = 0 }: { group: RuleGroup; level?: number }) => (
    <div className={`border border-gray-200 rounded-lg p-4 ${level > 0 ? 'ml-4' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <select
          className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={group.combinator}
          onChange={(e) =>
            updateCombinator(group.id, e.target.value as 'AND' | 'OR')
          }
        >
          <option value="AND">Match ALL conditions (AND)</option>
          <option value="OR">Match ANY condition (OR)</option>
        </select>

        <button
          type="button"
          className="btn btn-outline flex items-center gap-1 text-sm"
          onClick={() => addRule(group.id)}
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>

        <button
          type="button"
          className="btn btn-outline flex items-center gap-1 text-sm"
          onClick={() => addGroup(group.id)}
        >
          <Plus className="h-4 w-4" />
          Add Group
        </button>

        {level > 0 && (
          <button
            type="button"
            className="p-2 text-red-600 hover:text-red-700 transition-colors ml-auto"
            onClick={() => deleteGroup(group.id)}
            title="Delete group"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {group.rules.map((rule) => (
          <div key={rule.id}>
            {'combinator' in rule ? (
              <GroupComponent group={rule} level={level + 1} />
            ) : (
              <RuleComponent rule={rule} />
            )}
          </div>
        ))}

        {group.rules.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Add rules or groups to define your segment
          </p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(segment); }} className="space-y-4">
      <GroupComponent group={segment} />
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="btn btn-primary flex items-center gap-2"
          disabled={segment.rules.length === 0}
        >
          <Save className="h-4 w-4" />
          Save Segment
        </button>
      </div>
    </form>
  );
};

export default SegmentBuilder;